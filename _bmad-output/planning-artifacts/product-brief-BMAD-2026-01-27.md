---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2026-01-27
author: Yannick
---

# Product Brief: YoyImmo

## Executive Summary

**YoyImmo** est une application web de gestion de patrimoine immobilier locatif conçue pour les propriétaires français qui gèrent leurs biens en location longue durée. Née d'une frustration personnelle face aux outils existants trop complexes et inadaptés, YoyImmo offre une solution simple en surface mais complète en profondeur, permettant de gagner un temps précieux sur le suivi des biens et les déclarations fiscales.

L'application permet de gérer des biens individuels ou groupés (immeubles), de tracer facilement les loyers, charges, factures et impayés, tout en offrant une visualisation claire de la rentabilité et un export simplifié pour les déclarations d'impôts. La sécurité et la confidentialité des données sensibles (informations locataires, documents financiers) sont au cœur de l'architecture, avec un stockage local des documents accessible via l'interface web.

**Proposition de valeur clé** : Réduire drastiquement le temps passé sur la gestion administrative et fiscale des biens locatifs grâce à une interface intuitive (validation des loyers en un clic), un dashboard fiscal intelligent (pré-remplissage des cases d'impôts pour locations meublées/nues), et une gestion documentaire structurée et sécurisée.

---

## Core Vision

### Problem Statement

Les propriétaires de biens en location longue durée en France font face à une charge administrative chronophage et source d'erreurs. Que ce soit pour tracer les loyers payés, saisir les factures, ou préparer les déclarations fiscales, la gestion s'effectue typiquement via Excel et des dossiers éparpillés, créant une perte de temps significative et une difficulté à avoir une vision claire de la rentabilité de leur patrimoine.

Les propriétaires avec plusieurs biens (incluant locations nues, meublées, locaux commerciaux, gestion directe ou via agence) jonglent entre multiples sources d'information sans jamais avoir une vue d'ensemble cohérente et accessible.

### Problem Impact

**Impact opérationnel :**
- Perte de temps considérable sur des tâches administratives répétitives (traçabilité loyers, saisie factures)
- Difficulté de suivi en temps réel de l'état du patrimoine
- Stress lors de la préparation des déclarations fiscales annuelles

**Impact financier :**
- Impossibilité de visualiser facilement la rentabilité réelle par bien (loyers vs prix d'achat, charges, fiscalité)
- Risque de déductions fiscales manquées par manque d'organisation documentaire
- Potentielles erreurs de déclaration par manque de traçabilité

**Impact sécurité :**
- Documents sensibles (identités locataires, données financières, compromis de vente) stockés de manière non structurée
- Préoccupation croissante concernant la confidentialité des données personnelles dans les solutions cloud

**Cible** : Propriétaires français possédant au minimum 1 bien en location longue durée, qu'ils gèrent directement ou en partie via des agences.

### Why Existing Solutions Fall Short

Les solutions de gestion locative existantes sur le marché présentent plusieurs lacunes majeures :

**Complexité excessive :**
- Interfaces surchargées conçues pour des gestionnaires professionnels, pas pour des propriétaires individuels
- Courbe d'apprentissage trop importante pour un usage quotidien simple

**Absence de vision rentabilité :**
- Focus uniquement administratif sans permettre de visualiser la performance financière réelle
- Pas de calcul de rentabilité par rapport au prix d'achat initial du bien
- Dashboard inadaptés aux besoins de suivi d'investissement

**Modèles économiques inadaptés :**
- Solutions payantes (abonnements mensuels/annuels) même pour des propriétaires avec peu de biens
- Coût qui ne se justifie pas face aux fonctionnalités réellement utilisées

**Problématiques de confidentialité :**
- Stockage cloud obligatoire de données hautement sensibles (identités locataires, revenus locatifs, documents juridiques)
- Pas d'option de stockage local pour les propriétaires soucieux de la protection de leurs données

**Installation et accessibilité :**
- Solutions nécessitant des installations complexes ou des compétences techniques avancées
- Pas d'équilibre entre accessibilité web et sécurité locale

### Proposed Solution

**YoyImmo** est une application web moderne offrant le meilleur des deux mondes : la simplicité d'accès d'une webapp avec la sécurité du stockage local des documents sensibles.

**Architecture hybride intelligente :**
- Interface web accessible depuis n'importe quel navigateur
- Installation simplifiée en 1 clic (sans nécessiter d'expertise Docker)
- Documents sensibles stockés localement, accessibles de manière sécurisée via l'interface web
- Responsabilité et contrôle total des données restent au propriétaire

**Expérience utilisateur optimale :**
- **Dashboard intuitif** : Visualisation immédiate de tous les biens sur la page d'accueil
- **Gestion ultra-rapide** : Validation des loyers payés en un simple clic par bien
- **Simple en surface, complet en profondeur** : Interface épurée pour les actions courantes, fonctionnalités avancées accessibles pour les besoins spécifiques

**Fonctionnalités core (Phase 1) :**

*Gestion patrimoniale structurée :*
- Enregistrement des biens individuels avec toutes leurs caractéristiques
- Groupement de biens (ex: appartements d'un même immeuble)
- Profils locataires avec historique
- Distinction types de location (nu / meublé)

*Suivi financier complet :*
- Traçabilité des prix d'achat, loyers, charges, impayés, assurances
- Gestion documentaire structurée par bien/groupe avec catégorisation
- Visualisation claire de la rentabilité par bien et globale
- Dashboard financier avec historique complet

*Intelligence fiscale française :*
- Dashboard fiscal spécialisé pour les déclarations de revenus fonciers
- Pré-remplissage des cases fiscales pour locations meublées hors SCI (et autres régimes)
- Export structuré des données pour déclaration d'impôts
- Vision claire revenus/charges déductibles

*Génération documentaire :*
- Création et impression PDF de documents (baux, quittances de loyer)
- Templates personnalisables

**Fonctionnalités avancées (Phase 2) :**
- OCR intelligent pour interprétation automatique des documents
- Reconnaissance du type de document (facture, CR de gérance, bail...)
- Association automatique aux biens/groupes concernés
- Gestion des documents composites (ex: CR de gérance contenant plusieurs factures dans un même PDF)
- Extraction et pré-remplissage automatique des données (loyers régularisés, factures, etc.)

### Key Differentiators

**1. Sécurité et confidentialité par design**
- Stockage local des documents sensibles (pas de cloud obligatoire)
- Contrôle total des données par le propriétaire
- Architecture hybride : accessibilité web + sécurité locale
- Réponse directe aux préoccupations de confidentialité croissantes

**2. Simplicité ET complétude (pas un compromis)**
- Interface intuitive pour les actions quotidiennes (1 clic = loyer validé)
- Profondeur disponible pour analyses détaillées et historiques complets
- Courbe d'apprentissage douce mais puissance pour utilisateurs avancés

**3. Intelligence fiscale française**
- Connaissance approfondie de la fiscalité locative française (meublé/nu, SCI, régimes spéciaux)
- Dashboard fiscal avec visualisation des cases d'impôts à remplir
- Export optimisé pour déclarations fiscales françaises
- Gain de temps majeur sur la tâche la plus redoutée des propriétaires

**4. Vision rentabilité intégrée**
- Pas seulement un outil administratif mais un véritable outil de pilotage d'investissement
- Calcul et affichage de la rentabilité réelle par bien (vs prix d'achat, charges, fiscalité)
- Dashboard financier clair et actionnable
- Aide à la décision pour optimiser son patrimoine

**5. Expertise métier vécue**
- Solution conçue par un propriétaire pour des propriétaires
- Compréhension profonde des vrais problèmes quotidiens (pas de sur-ingénierie)
- Focus sur les tâches réellement chronophages et sources d'erreurs
- Architecture documentaire pensée pour la réalité (documents composites, multi-biens, etc.)

**6. Accessibilité et modèle économique**
- Installation simplifiée (1 clic, pas d'expertise technique requise)
- Cible dès 1 bien (pas réservé aux gros portefeuilles)
- Modèle économique à définir mais accessible (gratuit possible ou tarif justifié par la valeur)
- Pas d'abonnement forcé pour des fonctionnalités basiques

**7. Intelligence documentaire future**
- OCR de précision pour documents immobiliers complexes
- Compréhension contextuelle (routing automatique par bien/groupe)
- Gestion des cas réels (documents composites multiples)
- Extraction de données structurées pour automatisation

---

## Target Users

### Primary Users

**YoyImmo** cible les propriétaires français qui gèrent activement leur patrimoine immobilier locatif (minimum 1 bien), qui ne font pas tout gérer par une agence et qui se passent d'un comptable, ou qui souhaitent simplifier le suivi de leur patrimoine indépendamment de l'accompagnement qu'ils reçoivent.

Ces propriétaires partagent des caractéristiques communes :
- Gestion directe d'au moins une partie de leurs biens (pas 100% en agence)
- Souhait d'autonomie sur le suivi administratif et fiscal
- Besoin de clarté et de vision sur leur patrimoine
- Sensibilité au temps passé sur les tâches administratives
- Conscience que les outils actuels (Excel, dossiers éparpillés) ne sont pas viables sur le long terme

Deux profils utilisateurs principaux émergent avec des besoins légèrement différents :

#### Persona 1 : Thomas, le Jeune Investisseur en Croissance

**Profil :**
- 32 ans, cadre dans le secteur tech
- Possède 2 biens immobiliers en location longue durée
- Premier bien acheté il y a 3 ans, deuxième récemment acquis
- À l'aise avec le digital et les outils modernes
- Gestion directe de ses biens (pas d'agence)
- Pas de comptable (optimise ses coûts)

**Contexte & Motivation :**
Thomas investit dans l'immobilier pour constituer un patrimoine sur le long terme. Avec un seul bien, la gestion était simple - un fichier Excel basique suffisait. Mais l'acquisition du deuxième bien, combinée à des changements de locataires, a créé une complexité qu'il n'avait pas anticipée. Il doit maintenant jongler entre plusieurs loyers, différentes périodes de location, des factures qui s'accumulent pour différents biens, et il réalise que son fichier Excel devient vite confus.

**Situation actuelle (AVANT YoyImmo) :**
Thomas utilise un fichier Excel qu'il met à jour manuellement chaque mois. Il sauvegarde les documents (factures, baux, CR) dans des dossiers sur son ordinateur, organisés tant bien que mal par bien puis par année. Quand arrive la déclaration d'impôts, c'est le stress : il passe des heures à retrouver toutes les factures déductibles, à recalculer les montants, à vérifier qu'il n'a rien oublié. Il a peur de faire des erreurs fiscales et de passer à côté de déductions importantes.

**Frustrations principales :**
- Perte de temps à rechercher les documents lors de la déclaration fiscale
- Incertitude sur les montants à déclarer et les déductions possibles
- Peur de faire des erreurs qui pourraient coûter cher
- Fichier Excel qui devient rapidement difficile à maintenir avec la croissance
- Pas de vision claire de la rentabilité réelle de ses investissements

**Besoins spécifiques :**
- Système simple pour enregistrer les loyers et factures au fil de l'eau
- Organisation documentaire claire et retrouvable facilement
- Dashboard fiscal qui le guide pour la déclaration d'impôts
- Outil qui grandit avec lui (scalable de 2 à 5+ biens sans complexité)
- Interface moderne et intuitive adaptée à son aisance digitale

**Moment "Aha!" avec YoyImmo :**
La première déclaration d'impôts après avoir utilisé YoyImmo pendant un an. Au lieu de passer un week-end stressant à chercher des factures, Thomas clique sur "Export fiscal" et obtient immédiatement un récapitulatif clair avec tous les montants pré-calculés et les cases d'impôts à remplir. Il réalise qu'il vient de gagner 15 heures et d'éliminer tout le stress fiscal.

**Citation type :**
> "Avant YoyImmo, je passais des heures à me demander si j'avais bien tout compté pour mes impôts. Maintenant, j'enregistre mes factures au fur et à mesure en 2 clics, et au moment de la déclaration, tout est déjà prêt. C'est exactement ce qu'il me fallait !"

---

#### Persona 2 : Sophie, l'Investisseuse Active en Transition

**Profil :**
- 45 ans, profession libérale (architecte)
- Possède actuellement 8 biens immobiliers (5 existants + 3 récemment acquis)
- Mix de locations nues, meublées, et un local commercial
- Certains biens en gestion directe, d'autres via agence
- Pas de comptable dédié pour la gestion locative
- Investit activement depuis 10 ans

**Contexte & Motivation :**
Sophie a constitué progressivement son patrimoine immobilier pour préparer sa retraite et générer des revenus complémentaires. Avec 5 biens, elle avait développé un système Excel sophistiqué qui fonctionnait bien. Mais l'acquisition de 3 nouveaux biens simultanément a été un point de bascule - elle réalise que son système actuel n'est plus viable et qu'elle doit trouver une vraie solution de gestion.

**Situation actuelle (AVANT YoyImmo) :**
Sophie gère son patrimoine via un fichier Excel devenu massif, avec de nombreux onglets et formules complexes. Le problème : elle n'arrive plus à suivre le rythme. Elle met à jour son fichier tous les 4 à 6 mois seulement, en bloquant une journée entière (voire un week-end) pour tout rattraper. Pendant ces sessions marathon, elle épluche ses relevés bancaires, retrouve les factures, met à jour les loyers, et recalcule tout. Le résultat est bon pour la déclaration fiscale, mais c'est un processus épuisant et elle prend constamment du retard.

Avec 8 biens maintenant, elle sait que ce rythme de MAJ tous les 4-6 mois n'est plus tenable - elle a besoin d'une vision continue et claire sans ces sessions marathon.

**Frustrations principales :**
- Système Excel devenu lourd et chronophage à maintenir
- Retard constant sur la mise à jour des données (4-6 mois de latence)
- Sessions de mise à jour marathon qui prennent des heures
- Impossibilité d'avoir une vision en temps réel de son patrimoine
- Difficulté à identifier rapidement la performance de chaque bien
- Anticipation que ça va empirer avec la croissance du portefeuille

**Besoins spécifiques :**
- Migration facile depuis son système Excel existant
- Suivi continu sans sessions marathon de rattrapage
- Vision globale claire de tous les biens avec possibilité de drill-down
- Gestion des différents types de locations (nu/meublé/commercial)
- Support pour mix gestion directe/agence
- Dashboard de rentabilité par bien et global
- Historique complet et traçabilité sur plusieurs années

**Moment "Aha!" avec YoyImmo :**
Après 3 mois d'utilisation, Sophie réalise qu'elle est à jour sur tous ses biens. Elle enregistre les loyers en 1 clic depuis la page d'accueil chaque mois, upload les factures au fil de l'eau, et son dashboard lui montre en temps réel la performance de chaque bien. Pour la première fois en 10 ans d'investissement, elle a une vision claire et continue de son patrimoine sans avoir à bloquer des journées entières de mise à jour. Elle peut même comparer la rentabilité de ses différents biens et prendre des décisions éclairées.

**Citation type :**
> "J'ai passé 10 ans à gérer mon patrimoine via Excel avec des MAJ marathon tous les 4-6 mois. Avec YoyImmo, je suis toujours à jour sans effort. Je clique sur le loyer payé en 1 seconde, j'upload une facture en 10 secondes, et j'ai une vision claire en temps réel. Plus jamais de week-end perdu à rattraper mon retard !"

---

### Secondary Users

Aucun utilisateur secondaire n'a été identifié pour cette version initiale de YoyImmo. Le focus est exclusivement sur les propriétaires eux-mêmes qui gèrent activement leur patrimoine.

**Note** : Des utilisateurs secondaires potentiels pourraient émerger dans des versions futures (ex: conseillers en gestion de patrimoine, experts-comptables qui accompagnent des clients, conjoints co-gestionnaires), mais ils ne sont pas une priorité pour le MVP.

---

### User Journey

#### Journey Typique : Du Chaos Excel à la Clarté YoyImmo

**1. Discovery (Découverte)**

*Déclencheur* : Le propriétaire atteint un point de douleur critique :
- Thomas : Stress intense lors de sa première déclaration avec 2 biens
- Sophie : Réalisation que les MAJ Excel marathon ne sont plus viables avec 8 biens

*Comment ils découvrent YoyImmo* :
- Recherche Google : "gestion patrimoine immobilier gratuit", "alternative Excel gestion locative"
- Bouche-à-oreille de communautés d'investisseurs immobiliers
- Forums et groupes Facebook dédiés à l'investissement locatif
- GitHub (pour les utilisateurs à l'aise avec le tech)

*Première impression* : "Une solution simple, moderne, et surtout GRATUITE qui respecte mes données ?"

**2. Onboarding (Première Expérience)**

*Installation* :
- Installation en 1 clic depuis le site ou GitHub
- Setup initial guidé : configuration stockage local, création du premier bien
- Interface claire et épurée : "Ça a l'air vraiment simple !"

*Configuration initiale* :
- Ajout des premiers biens avec leurs caractéristiques
- Création des profils locataires
- Import optionnel de données Excel existantes (pour Sophie)
- Configuration des types de location (nu/meublé)

*Premier succès rapide* :
- Thomas : Enregistre son premier loyer en 1 clic depuis la home page - "Wow, c'est tout ?"
- Sophie : Importe ses 8 biens et voit immédiatement son dashboard global - "Enfin une vision claire !"

**3. Core Usage (Utilisation Quotidienne)**

*Routine mensuelle typique (5-10 minutes)* :
- Ouverture de YoyImmo sur la page d'accueil
- Vue d'ensemble de tous les biens avec statut des loyers
- Validation des loyers payés en 1 clic par bien
- Upload des nouvelles factures reçues (drag & drop)
- Consultation rapide du dashboard financier

*Gestion ponctuelle* :
- Nouveau locataire : Création du profil, génération du bail via template
- Travaux : Enregistrement des factures avec catégorisation automatique
- Fin de mois : Impression des quittances de loyer en PDF
- Nouvel achat : Ajout d'un bien avec ses caractéristiques
- Impayé : Marquage du loyer comme impayé avec suivi

*Consultation régulière* :
- Dashboard de rentabilité : "Comment performent mes biens ?"
- Historique complet : "Quand ai-je fait cette réparation déjà ?"
- Documents : Retrouver un bail ou une facture en quelques secondes

**4. Success Moment (Moment de Réalisation de la Valeur)**

*Déclaration d'impôts annuelle* :
Le moment où YoyImmo révèle toute sa valeur :

- Clic sur "Dashboard Fiscal"
- Visualisation immédiate des cases d'impôts à remplir (2042, 2044, etc.)
- Montants pré-calculés : revenus locatifs, charges déductibles
- Export structuré pour la déclaration
- **Temps passé : 30 minutes au lieu de 10-15 heures**

*Réaction utilisateur* :
- Thomas : "Je n'arrive pas à croire que c'était si simple. Toutes mes factures sont là, tout est calculé. C'est magique !"
- Sophie : "Pour la première fois en 10 ans, je n'ai pas stressé pour ma déclaration. Tout était déjà prêt, organisé, vérifié."

*Autres moments "wow"* :
- Vision instantanée de la rentabilité : "Ah, cet appartement performe mieux que je pensais !"
- Retrouver un document en 5 secondes : "Avant je cherchais pendant 20 minutes dans mes dossiers"
- Comparer la performance de plusieurs biens côte à côte
- Réaliser qu'on est toujours à jour sans effort particulier

**5. Long-term (Utilisation sur le Long Terme)**

*YoyImmo devient indispensable* :

**Habitudes ancrées** :
- Loyer reçu → Ouverture automatique de YoyImmo pour valider (réflexe)
- Facture reçue → Upload immédiat dans YoyImmo
- Question sur un bien → Consultation du dashboard
- Décision d'investissement → Analyse de rentabilité dans YoyImmo

**Évolution avec le patrimoine** :
- Thomas passe de 2 à 5 biens sur 3 ans : YoyImmo scale sans complexité
- Sophie ajoute 2 nouveaux biens : Même simplicité, même clarté
- L'outil grandit naturellement avec le portefeuille

**Ambassadeurs** :
Les utilisateurs satisfaits deviennent promoteurs :
- Recommandation à d'autres investisseurs
- Partage sur les forums et groupes
- Contributions via pourboires (tip jar) pour soutenir le projet
- Potentiellement : contributions au projet open-source (suggestions, bug reports)

**Tranquillité d'esprit continue** :
- Plus de stress fiscal annuel
- Vision claire permanente du patrimoine
- Confiance dans les données et la traçabilité
- Temps récupéré pour se concentrer sur la stratégie d'investissement plutôt que l'admin
- "YoyImmo gère l'administratif, je me concentre sur la croissance de mon patrimoine"

---

## Success Metrics

Le succès de **YoyImmo** se mesure d'abord par sa capacité à résoudre concrètement le problème de gestion patrimoniale pour ses utilisateurs, en transformant une tâche administrative chronophage et stressante en une routine simple et agréable. En tant que projet open-source gratuit, le succès se définit par l'impact réel sur la vie quotidienne des propriétaires, avec la croissance de la communauté comme bonus appréciable mais non prioritaire.

### User Success Metrics

**Indicateurs de Succès Primaires (Ce qui compte vraiment) :**

**1. Gain de temps fiscal (Objectif #1)**
- **Métrique cible** : Réduction du temps de préparation de déclaration fiscale de 10-15 heures à moins de 1 heure
- **Mesure** : Temps passé sur dashboard fiscal + export vs temps passé avant YoyImmo
- **Succès** : Utilisateur complète sa déclaration en < 1h avec toutes les informations nécessaires pré-calculées

**2. Précision fiscale**
- **Métrique** : Confiance dans l'exactitude des montants déclarés
- **Indicateur** : Zéro erreur de calcul, toutes les charges déductibles identifiées et catégorisées
- **Succès** : Utilisateur ne doute plus des montants à déclarer, toutes les factures sont tracées et catégorisées correctement

**3. Tenue à jour mensuelle (Signal fort d'adoption)**
- **Métrique cible** : ≥ 80% des utilisateurs mettent à jour YoyImmo chaque mois
- **Mesure** : Fréquence de saisie des loyers et factures
- **Succès** : Utilisateur enregistre les loyers et factures le mois où ils surviennent (fini le retard de 4-6 mois)

**4. Rapidité et fluidité d'utilisation**
- **Métrique** : Temps de saisie mensuelle < 10 minutes pour routine complète
- **Actions mesurées** :
  - Validation d'un loyer : < 5 secondes (1 clic)
  - Ajout d'une facture : < 30 secondes (upload + catégorisation)
  - Consultation dashboard : accès instantané
- **Succès** : Utilisateur gère son patrimoine "au fil de l'eau" sans effort conscient

**5. Gestion proactive des impayés**
- **Métrique** : Réduction du délai de détection d'impayés de plusieurs semaines à 0 jours
- **Fonctionnalité clé** : Rappels automatiques basés sur les dates de paiement définies dans les baux
- **Succès** : Sophie (8 biens) n'a plus besoin de suivre manuellement les dates de loyer - l'app la notifie automatiquement

**Indicateurs de Succès Secondaires (Engagement et Satisfaction) :**

**6. Plaisir d'utilisation (Engagement positif)**
- **Métrique** : Fréquence de consultation volontaire du dashboard et stats
- **Indicateurs** :
  - Utilisateur consulte classement des biens par rendement régulièrement
  - Utilisateur suit l'état des crédits en cours
  - Utilisateur explore les métriques de performance par curiosité/plaisir
- **Succès** : YoyImmo devient un "go-to" pour toute question sur le patrimoine, pas juste une corvée administrative

**7. Retrouvabilité des informations**
- **Métrique** : Temps pour retrouver un document ou une information
- **Cible** : < 10 secondes pour retrouver n'importe quel document ou donnée
- **Succès** : Utilisateur ne cherche plus 20 minutes dans des dossiers éparpillés

**8. Scalabilité sans friction**
- **Métrique** : Temps de gestion ne croît pas linéairement avec le nombre de biens
- **Indicateur** : Gérer 8 biens prend < 2x le temps de gérer 2 biens
- **Succès** : Thomas peut passer de 2 à 5 biens sans augmentation significative du temps de gestion

**Indicateurs d'Adoption Durable :**

**9. Utilisation multi-mensuelle**
- **Métrique** : Fréquence moyenne d'utilisation ≥ 3-4 fois par mois
- **Moments typiques** :
  - Réception loyers (1-8x selon nombre de biens)
  - Réception factures (variables)
  - Consultation dashboard (ad-hoc)
- **Succès** : YoyImmo devient le hub central pour toute gestion patrimoniale

**10. Rétention long-terme**
- **Métrique** : % utilisateurs actifs après 3 mois, 6 mois, 12 mois
- **Cible** : ≥ 70% rétention à 6 mois (signifie que l'outil résout vraiment le problème)
- **Succès** : Utilisateurs ne reviennent pas à Excel ou solutions alternatives

**11. Moment "Aha!" mesurable**
- **Première déclaration fiscale post-YoyImmo** : Satisfaction maximale quand utilisateur réalise le gain de temps massif
- **Indicateur** : Utilisateur utilise l'export fiscal complet pour sa déclaration
- **Succès** : "C'est magique !" - réaction de soulagement et surprise positive

---

### Business Objectives

**YoyImmo** est un projet open-source gratuit créé pour résoudre un besoin personnel vécu. Le succès business se définit de manière non-conventionnelle, centrée sur l'impact utilisateur plutôt que la croissance commerciale.

**Objectif Principal : Résolution du Problème Personnel**

**Succès à 3 mois :**
- **Pour le créateur** : YoyImmo résout efficacement le problème de gestion des 8 biens personnels
- **Satisfaction personnelle** : Fini les sessions Excel marathon, toujours à jour mensuellement
- **Validation du concept** : La déclaration fiscale personnelle se fait en < 1h avec YoyImmo

**Succès à 6 mois :**
- **Stabilité** : L'application est fiable, pas de bugs critiques sur les fonctionnalités core
- **Habitudes ancrées** : YoyImmo est devenu le réflexe naturel pour toute gestion patrimoniale
- **ROI personnel** : Gain de temps cumulé mesurable (économie de dizaines d'heures)

**Succès à 12 mois :**
- **Déclaration fiscale annuelle complète** : Premier cycle fiscal complet réussi avec YoyImmo
- **Confiance totale** : Toutes les données sont exactes, traçables, et complètes
- **Évolution** : Ajout de nouveaux biens sans complexité ajoutée

**Objectif Secondaire : Impact Communautaire (Bonus Apprécié)**

**Adoption organique :**
- **Pas de cible chiffrée fixe** : Tout utilisateur supplémentaire qui bénéficie de YoyImmo est une victoire
- **Croissance naturelle** : Via bouche-à-oreille, communautés d'investisseurs, GitHub
- **Qualité > Quantité** : Préférence pour des utilisateurs engagés qui trouvent réellement de la valeur

**Modèle Open-Source avec Pourboire :**
- **Objectif** : Rendre YoyImmo accessible gratuitement à tous les propriétaires
- **Système de pourboire (tip jar)** : Option pour soutenir le projet, mais non obligatoire ni prioritaire
- **Mesure de succès** : Témoignages d'utilisateurs satisfaits et volonté de contribuer (financièrement ou via feedback)

**Engagement Communautaire :**
- **Feedback constructif** : Bug reports, suggestions d'amélioration de vrais utilisateurs
- **Contributions** : Pull requests, traductions, documentation (si la communauté se développe)
- **Partage** : Recommandations sur forums d'investissement immobilier, groupes Facebook, Reddit

**Impact Mesurable (si la communauté croît) :**
- **Heures économisées collectivement** : Si 50 utilisateurs économisent chacun 10h sur leur déclaration fiscale = 500h de temps récupéré
- **Propriétaires aidés** : Nombre de propriétaires qui passent du chaos Excel à la clarté YoyImmo
- **Stars GitHub / Mentions** : Indicateur de reconnaissance de la communauté (bonus, pas objectif)

---

### Key Performance Indicators

**KPIs Utilisateur (Priorité Absolue) :**

**KPI 1 : Taux de Mise à Jour Mensuelle**
- **Définition** : % d'utilisateurs qui enregistrent au moins 1 loyer ou 1 facture par mois
- **Cible** : ≥ 80%
- **Mesure** : Timestamp dernière activité de saisie par utilisateur
- **Signification** : Indicateur que YoyImmo remplace effectivement Excel et devient l'outil quotidien

**KPI 2 : Temps de Préparation Fiscale**
- **Définition** : Temps passé de l'ouverture du dashboard fiscal à la génération de l'export complet
- **Cible** : < 60 minutes (vs 10-15h avant)
- **Mesure** : Self-reported ou tracking dans l'app
- **Signification** : Validation du gain de temps, objectif #1 du produit

**KPI 3 : Utilisation Dashboard Fiscal**
- **Définition** : % d'utilisateurs qui utilisent la fonctionnalité export fiscal lors de leur déclaration
- **Cible** : ≥ 90% lors de la période fiscale (avril-mai)
- **Mesure** : Utilisation feature "Export Fiscal" ou "Dashboard Fiscal"
- **Signification** : Les utilisateurs font confiance à YoyImmo pour leurs impôts

**KPI 4 : Rapidité de Saisie**
- **Définition** : Temps moyen pour valider un loyer ou ajouter une facture
- **Cible** : Loyer < 10 sec, Facture < 60 sec
- **Mesure** : Analytics intégrées (optionnel, respectant vie privée)
- **Signification** : L'UX est effectivement simple et fluide

**KPI 5 : Efficacité Gestion Impayés**
- **Définition** : Délai moyen entre date de paiement prévue et détection d'impayé
- **Cible** : 0 jour (notification automatique le jour J)
- **Mesure** : Système de rappels automatiques actif
- **Signification** : Plus besoin de suivre manuellement les dates

**KPIs Engagement (Indicateurs de Valeur) :**

**KPI 6 : Fréquence d'Utilisation Mensuelle**
- **Définition** : Nombre moyen de sessions par utilisateur par mois
- **Cible** : ≥ 3-4 sessions/mois
- **Mesure** : Session = ouverture active de l'application
- **Signification** : YoyImmo est utilisé régulièrement, pas abandonné

**KPI 7 : Taux de Rétention à 6 Mois**
- **Définition** : % utilisateurs toujours actifs 6 mois après première utilisation
- **Cible** : ≥ 70%
- **Mesure** : Utilisateurs avec activité dans les 30 derniers jours
- **Signification** : L'outil résout durablement le problème

**KPI 8 : Consultation Dashboard Rentabilité**
- **Définition** : % utilisateurs qui consultent les métriques de performance au moins 1x/mois
- **Cible** : ≥ 50%
- **Mesure** : Accès à la section classement/rendement/stats
- **Signification** : Les utilisateurs trouvent du plaisir et de la valeur au-delà de l'admin

**KPIs Projet (Open-Source, Modeste) :**

**KPI 9 : Adoption Organique**
- **Définition** : Nombre d'utilisateurs actifs (sans objectif chiffré fixe)
- **Mesure** : Installations + utilisateurs actifs mensuels
- **Signification** : Tout utilisateur supplémentaire = impact positif

**KPI 10 : Qualité du Feedback**
- **Définition** : Ratio feedback constructif / bug reports vs plaintes
- **Mesure** : Issues GitHub, messages utilisateurs
- **Signification** : Utilisateurs engagés qui veulent améliorer l'outil

**KPI 11 : Contributions Communautaires (si applicable)**
- **Définition** : Pourboires reçus, suggestions, pull requests
- **Mesure** : Tip jar, contributions GitHub
- **Signification** : Les utilisateurs valorisent suffisamment YoyImmo pour contribuer

**Métriques de Santé Technique :**

**KPI 12 : Fiabilité**
- **Définition** : Uptime et stabilité de l'application
- **Cible** : 0 bugs critiques, < 5 bugs mineurs
- **Mesure** : Bug tracking, crash reports
- **Signification** : L'application est fiable pour gérer des données sensibles

**KPI 13 : Performance**
- **Définition** : Temps de chargement et réactivité
- **Cible** : Dashboard charge en < 2 sec, actions instantanées
- **Mesure** : Performance monitoring
- **Signification** : L'expérience reste fluide même avec beaucoup de données

---

**Philosophie de Mesure :**

Le succès de YoyImmo se mesure d'abord à l'aune de **l'impact réel sur la vie quotidienne** des utilisateurs :
- **Moins de stress fiscal**
- **Plus de clarté patrimoniale**
- **Temps récupéré** pour se concentrer sur ce qui compte vraiment

La croissance de la base utilisateurs est un **indicateur secondaire bienvenu** mais jamais une fin en soi. Un seul utilisateur pleinement satisfait vaut mieux que 100 utilisateurs frustrés.

L'objectif ultime : que chaque propriétaire qui utilise YoyImmo puisse dire avec soulagement : **"Enfin, je suis toujours à jour, et mes impôts ne sont plus un cauchemar."**

---

## MVP Scope

### Core Features

**1. Gestion du Patrimoine**
- **Gestion des biens immobiliers** : Création et configuration des propriétés avec leurs caractéristiques (adresse, type de location nu/meublé, surface, valeur d'achat)
- **Gestion des locataires** : Profils locataires avec informations de contact et historique
- **Gestion des baux** : Création et suivi des contrats de location avec dates de début/fin, montant du loyer, date de paiement prévue

**2. Suivi des Loyers (Fonctionnalité Core)**
- **Validation ultra-rapide** : 1-clic depuis la page d'accueil pour marquer un loyer comme payé
- **Gestion des paiements partiels** : Support des paiements incomplets avec suivi du solde restant
- **Rappels automatiques** : Notification J-2 avant la date de paiement prévue pour anticiper les impayés
- **Détection des impayés** : Marquage et suivi des loyers non reçus

**3. Gestion des Charges et Factures**
- **Enregistrement des factures** : Upload et catégorisation des charges déductibles
- **Association automatique aux biens** : Chaque facture est liée au bien concerné
- **Catégorisation fiscale** : Organisation des charges selon les catégories fiscales françaises (travaux, intérêts d'emprunt, assurances, charges de copropriété, etc.)

**4. Dashboard Fiscal MVP (Version Simple)**
- **Accès aux totaux annuels** : Affichage des revenus locatifs totaux et charges déductibles totales
- **Vue par bien** : Détail des revenus et charges par propriété
- **Export des données** : Export structuré des montants pour faciliter la déclaration d'impôts
- **Période fiscale** : Calcul automatique pour l'année fiscale en cours

**5. Stockage Local des Documents**
- **Documents par bien** : Organisation claire des baux, factures, et autres documents par propriété
- **Recherche et retrouvabilité** : Accès rapide à n'importe quel document en quelques secondes
- **Sécurité locale** : Toutes les données restent sur la machine de l'utilisateur

**6. Interface Web Moderne**
- **Page d'accueil centralisée** : Vue d'ensemble de tous les biens avec statut des loyers
- **Navigation intuitive** : Accès rapide à toutes les fonctionnalités
- **Responsive design** : Utilisable sur desktop et mobile

---

### Out of Scope for MVP

**Fonctionnalités reportées à V1.1 :**
- Dashboard rentabilité et performance (métriques de rendement, classement des biens par performance, ROI)
- Suivi détaillé des crédits en cours avec échéanciers
- Dashboard fiscal complet avec pré-remplissage intelligent des cases d'impôts spécifiques (2042, 2044, etc.)

**Fonctionnalités Post-MVP :**
- Génération automatique de quittances de loyer en PDF
- Templates de documents personnalisables
- Historique détaillé et visualisations graphiques

**Hors scope définitif :**
- Import depuis Excel : Les données utilisateurs sont trop variables et non standardisées, l'import ne serait pas fiable
- Gestion multi-utilisateurs ou comptes partagés
- Synchronisation cloud ou backup automatique (local-first par design)
- OCR et intelligence documentaire avancée (vision long-terme future)

---

### MVP Success Criteria

**Efficacité opérationnelle :**
- ✅ Enregistrer un loyer en **< 10 secondes** (1-clic depuis la home)
- ✅ Ajouter une facture en **< 60 secondes** (upload + catégorisation)
- ✅ Retrouver n'importe quel document en **< 10 secondes**

**Valeur fiscale :**
- ✅ Dashboard fiscal fournit tous les **totaux nécessaires** pour la déclaration d'impôts
- ✅ Catégorisation fiscale correcte de toutes les charges déductibles
- ✅ Export structuré utilisable directement lors de la déclaration

**Fiabilité :**
- ✅ **Rappels automatiques** fonctionnent pour tous les biens (J-2 avant date de paiement)
- ✅ Détection immédiate des impayés (délai = 0 jour)
- ✅ Aucune perte de données, stockage local fiable

**Scalabilité :**
- ✅ L'application fonctionne de manière fluide de **1 à 10+ biens** sans ralentissement
- ✅ Le temps de gestion mensuelle reste **< 10 minutes** quel que soit le nombre de biens

**Adoption :**
- ✅ Un utilisateur peut être **opérationnel en moins de 30 minutes** (setup + premier bien configuré)
- ✅ L'interface est suffisamment intuitive pour ne pas nécessiter de documentation

---

### Future Vision

**V1.1 : Intelligence Patrimoniale**
- **Dashboard de performance** : Métriques de rendement locatif, ROI, classement des biens par rentabilité
- **Suivi des crédits** : Échéanciers, capital restant dû, intérêts payés
- **Dashboard fiscal complet** : Pré-remplissage intelligent des cases d'impôts (2042, 2044) avec recommandations fiscales

**Post-MVP : Automatisation Documentaire**
- **Génération de quittances PDF** : Production automatique de quittances de loyer personnalisées
- **Templates personnalisables** : Modèles de documents adaptés aux besoins de chaque propriétaire
- **Historique et graphiques** : Visualisations des évolutions dans le temps

**Vision Long-Terme : Intelligence Documentaire**
- **OCR de précision** : Extraction automatique des données depuis les factures scannées
- **Compréhension contextuelle** : Routing automatique des documents par bien/groupe
- **Gestion des cas complexes** : Documents composites, factures multiples, détection d'anomalies
- **Extraction structurée** : Transformation automatique des documents en données exploitables

**Expansion Fonctionnelle Future :**
- Support des autres régimes fiscaux (micro-foncier, réel simplifié, LMNP, LMP)
- Gestion des charges locatives récupérables
- Suivi des travaux et amortissements
- Intégration bancaire pour réconciliation automatique

**Philosophie de croissance** : Chaque fonctionnalité future doit **simplifier la vie quotidienne** des propriétaires sans ajouter de complexité à l'interface. YoyImmo doit rester **simple, rapide, et centré sur l'essentiel**, même avec des fonctionnalités avancées.
