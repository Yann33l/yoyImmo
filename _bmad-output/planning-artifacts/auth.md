# Architecture d’authentification évolutive (NestJS)

Ce document résume **l’architecture complète** discutée dans la conversation :

* commencer simple (app maison / locale)
* évoluer vers une architecture SaaS
* sans refactor massif
* avec de bonnes pratiques de sécurité

---

## 🎯 Objectifs

* Démarrer **sans complexité inutile**
* Pouvoir passer de **session serveur → JWT + cookies** facilement
* Garder un **code métier inchangé**
* Être compatible :

  * app locale
  * open-source
  * SaaS public

---

## 🧠 Principes fondamentaux

### 1. JWT n’est pas une base

> **JWT est une optimisation**, pas un prérequis.

* Utile pour : SaaS, multi-instances, API publiques
* Inutile pour : app locale, mono-utilisateur, app interne

---

### 2. Séparation stricte des responsabilités

| Élément          | Rôle                         |
| ---------------- | ---------------------------- |
| bcrypt           | Vérifier un mot de passe     |
| OAuth2           | Déléguer l’authentification  |
| JWT              | Prouver l’identité           |
| Cookies HttpOnly | Stocker le token en sécurité |
| DB users         | Source de vérité métier      |

---

### 3. Le métier ne connaît PAS la techno d’auth

Règle d’or :

> **Le domaine ne doit dépendre que d’un utilisateur courant**

---

## 🧩 Contrat central : `CurrentUser`

```ts
interface CurrentUser {
  id: string;
  email: string;
  roles: string[];
}
```

* Injecté dans les controllers
* Identique que l’auth soit : session, JWT ou OAuth2

---

## 🏗️ Architecture en couches

```
Controller
   ↓
Auth Adapter (remplaçable)
   ↓
CurrentUser
   ↓
Domain / UseCases (IMMUTABLE)
```

---

## 🧱 Phase 1 — App maison / locale

### Caractéristiques

* Session serveur
* Cookie de session
* Pas de JWT

### Avantages

* Simple
* Logout immédiat
* Peu d’erreurs de sécurité

### Flux

```
Login
 → session créée
 → cookie session
 → req.user injecté
```

---

## 🔁 Phase 2 — Migration SaaS

### Caractéristiques

* JWT access token (15 min)
* Refresh token opaque (7 jours)
* Cookies HttpOnly
* Stateless

### Ce qui change

* Seulement l’adaptateur d’auth
* Pas le métier
* Pas les controllers

---

## 🔀 Guard unifié (clé de l’évolutivité)

```ts
@UseGuards(AppAuthGuard)
```

Le guard choisit dynamiquement :

* SessionAuthGuard
* JwtAuthGuard

Via :

```
AUTH_MODE=session | jwt
```

---

## 🔐 JWT : règles essentielles

* Vérifié **à chaque requête**
* Signature + expiration
* Payload minimal (`sub`, `email`)
* Jamais de données sensibles

---

## 🍪 Cookies HttpOnly

Pourquoi :

* Protection XSS
* Protection CSRF (`sameSite=strict`)
* Pas de token exposé au frontend

---

## 🔄 Refresh token (sécurisé)

### Principes

* Token opaque
* Stocké hashé en DB
* Usage unique (rotation)

### Flux

```
/refresh
 → vérifie refresh token
 → supprime l’ancien
 → génère un nouveau couple
```

---

## 🚪 Logout

### Logout simple

* Clear cookies

### Logout global

* Supprime tous les refresh tokens du user
* Tous les devices invalidés

---

## 🧪 Tests sans auth réelle

### FakeAuthGuard

* Injecte un user fictif
* Aucun JWT / session

Avantages :

* Tests rapides
* Pas de dépendance sécurité

---

## 🌍 OAuth2 (optionnel)

* Remplace le login + bcrypt
* Ne remplace PAS JWT
* À la fin : toujours un `CurrentUser`

---

## 🧠 Quand NE PAS utiliser JWT

* App locale
* App interne
* Open-source self-hosted simple
* Besoin de révocation immédiate

---

## ⚖️ Synthèse finale

> **On ne construit pas une app autour d’un JWT.**
> **On construit une app autour d’un utilisateur courant.**

Cette architecture permet :

* simplicité au début
* sécurité maîtrisée
* migration SaaS sans douleur
* code propre et durable

---

✅ Fin du résumé

---

## 📎 Annexes — Exemples de code NestJS complets

### `CurrentUser` (contrat central)

```ts
export interface CurrentUser {
  id: string;
  email: string;
  roles: string[];
}
```

---

### Decorator `@CurrentUser()`

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

---

### AppAuthGuard (switch session / JWT)

```ts
@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private sessionGuard: SessionAuthGuard,
    private jwtGuard: JwtAuthGuard,
  ) {}

  canActivate(ctx: ExecutionContext) {
    const mode = this.config.get('AUTH_MODE');
    return mode === 'jwt'
      ? this.jwtGuard.canActivate(ctx)
      : this.sessionGuard.canActivate(ctx);
  }
}
```

---

### SessionAuthGuard (phase 1)

```ts
@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    if (!req.session?.user) return false;

    req.user = req.session.user;
    return true;
  }
}
```

---

### JwtAuthGuard (phase 2)

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

---

### JWT Strategy

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.access_token,
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles ?? [],
    };
  }
}
```

---

### AuthModule

```ts
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AppAuthGuard,
    SessionAuthGuard,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [AppAuthGuard],
})
export class AuthModule {}
```

---

### Controller métier (immuable)

```ts
@Controller('users')
@UseGuards(AppAuthGuard)
export class UsersController {
  @Get('me')
  me(@CurrentUser() user: CurrentUser) {
    return user;
  }
}
```

---

### Login — session (phase 1)

```ts
req.session.user = {
  id: user.id,
  email: user.email,
  roles: user.roles,
};
```

---

### Login — JWT + cookies (phase 2)

```ts
const accessToken = jwt.sign(
  { sub: user.id, email: user.email, roles: user.roles },
  process.env.JWT_SECRET,
  { expiresIn: '15m' },
);

res.cookie('access_token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
});
```

---

### Refresh token (génération + stockage)

```ts
const refreshToken = randomUUID();
const hashed = await bcrypt.hash(refreshToken, 10);

await refreshRepo.save({
  userId: user.id,
  tokenHash: hashed,
  expiresAt: addDays(new Date(), 7),
});
```

---

### Endpoint `/refresh`

```ts
@Post('refresh')
async refresh(@Req() req, @Res() res) {
  const token = req.cookies.refresh_token;
  if (!token) throw new UnauthorizedException();

  const stored = await refreshRepo.findValid(token);
  if (!stored) throw new UnauthorizedException();

  await refreshRepo.delete(stored.id);

  const user = await usersRepo.findById(stored.userId);
  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie('access_token', accessToken, {...});
  res.cookie('refresh_token', refreshToken, {...});

  res.send({ message: 'refreshed' });
}
```

---

### Logout simple

```ts
@Post('logout')
logout(@Res() res) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  return res.send({ message: 'logged out' });
}
```

---

### Logout global

```ts
@Post('logout-all')
async logoutAll(@CurrentUser() user, @Res() res) {
  await refreshRepo.deleteByUser(user.id);

  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  res.send({ message: 'logged out everywhere' });
}
```

---

### FakeAuthGuard (tests)

```ts
@Injectable()
export class FakeAuthGuard {
  canActivate(ctx) {
    const req = ctx.switchToHttp().getRequest();
    req.user = {
      id: 'test-user',
      email: 'test@test.com',
      roles: [],
    };
    return true;
  }
}
```

---

### Override guard en e2e

```ts
.overrideGuard(AppAuthGuard)
.useClass(FakeAuthGuard)
```
