---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success']
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-BMAD-2026-01-27.md'
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
workflowType: 'prd'
date: 2026-01-27
author: Yannick
project_name: YoyImmo
classification:
  projectType: 'web_app'
  domain: 'general'
  complexity: 'medium'
  projectContext: 'greenfield'
---

# Product Requirements Document - YoyImmo

**Author:** Yannick
**Date:** 2026-01-27

## Success Criteria

### User Success

**Objectif primaire : Réduction drastique du temps et stress administratif**

**Critères de succès utilisateur mesurables :**

1. **Gain de temps fiscal (Objectif #1)**
   - Réduction du temps de préparation de déclaration fiscale : de 10-15 heures → moins de 1 heure
   - L'utilisateur complète sa déclaration en < 1h avec toutes les informations nécessaires pré-calculées
   - Moment "Aha!" : Première déclaration d'impôts post-YoyImmo où l'utilisateur réalise le gain de temps massif

2. **Précision et confiance fiscale**
   - Zéro erreur de calcul
   - Toutes les charges déductibles identifiées et catégorisées correctement
   - L'utilisateur ne doute plus des montants à déclarer
   - Toutes les factures sont tracées et organisées

3. **Tenue à jour sans effort**
   - ≥ 80% des utilisateurs mettent à jour YoyImmo chaque mois
   - L'utilisateur enregistre les loyers et factures le mois où ils surviennent
   - Fini le retard de 4-6 mois caractéristique des systèmes Excel
   - Gestion "au fil de l'eau" sans effort conscient

4. **Rapidité et fluidité d'utilisation**
   - Validation d'un loyer : < 10 secondes (1 clic depuis la home)
   - Ajout d'une facture : < 60 secondes (upload + catégorisation)
   - Consultation dashboard : accès instantané
   - Retrouver n'importe quel document : < 10 secondes

5. **Gestion proactive des impayés**
   - Délai de détection d'impayés : 0 jour (notification automatique)
   - Rappels automatiques J-2 avant la date de paiement prévue
   - Plus besoin de suivre manuellement les dates de loyer

6. **Scalabilité sans friction**
   - Gérer 8 biens prend < 2x le temps de gérer 2 biens
   - Le temps de gestion mensuelle reste < 10 minutes quel que soit le nombre de biens
   - L'utilisateur peut passer de 2 à 5+ biens sans augmentation significative du temps de gestion

7. **Adoption et apprentissage**
   - L'utilisateur peut être opérationnel en < 30 minutes (setup + premier bien configuré)
   - L'interface est suffisamment intuitive pour ne pas nécessiter de documentation
   - Premier succès rapide dès l'enregistrement du premier loyer

### Business Success

**Philosophie : Impact utilisateur avant croissance**

YoyImmo est un projet open-source gratuit créé pour résoudre un besoin personnel vécu. Le succès business se définit de manière non-conventionnelle, centrée sur l'impact réel plutôt que la croissance commerciale.

**Objectif Principal : Résolution du Problème Personnel**

**Succès à 3 mois :**
- YoyImmo résout efficacement le problème de gestion des 8 biens personnels du créateur
- Fini les sessions Excel marathon, toujours à jour mensuellement
- La déclaration fiscale personnelle se fait en < 1h avec YoyImmo

**Succès à 6 mois :**
- L'application est fiable, pas de bugs critiques sur les fonctionnalités core
- YoyImmo est devenu le réflexe naturel pour toute gestion patrimoniale
- Gain de temps cumulé mesurable (économie de dizaines d'heures)

**Succès à 12 mois :**
- Premier cycle fiscal complet réussi avec YoyImmo
- Toutes les données sont exactes, traçables, et complètes
- Ajout de nouveaux biens sans complexité ajoutée

**Objectif Secondaire : Impact Communautaire (Bonus Apprécié)**

**Adoption organique :**
- Pas de cible chiffrée fixe - tout utilisateur supplémentaire qui bénéficie de YoyImmo est une victoire
- Croissance naturelle via bouche-à-oreille, communautés d'investisseurs, GitHub
- Qualité > Quantité : préférence pour des utilisateurs engagés qui trouvent réellement de la valeur

**Modèle Open-Source avec Pourboire :**
- Rendre YoyImmo accessible gratuitement à tous les propriétaires
- Système de pourboire (tip jar) optionnel pour soutenir le projet
- Mesure de succès : témoignages d'utilisateurs satisfaits et volonté de contribuer

**Engagement Communautaire (si la communauté se développe) :**
- Feedback constructif : bug reports, suggestions d'amélioration
- Contributions : pull requests, traductions, documentation
- Partage : recommandations sur forums d'investissement immobilier, groupes, Reddit

### Technical Success

**Performance : Instantanéité**
- Tout doit sembler instantané (architecture locale, pas de grosse volumétrie)
- Dashboard charge en < 2 secondes
- Actions utilisateur (validation loyer, upload facture) : réponse immédiate
- Recherche de documents : résultats instantanés

**Fiabilité : Disponibilité Locale**
- Toujours disponible en local (pas de dépendance cloud/réseau)
- 0 bugs critiques
- < 5 bugs mineurs
- Aucune perte de données, stockage local fiable
- Système de rappels automatiques fonctionne pour tous les biens

**Sécurité : Protection des Données Sensibles**
- Documents sensibles peuvent être **cryptés à la demande** (paramétrage utilisateur)
- Stockage local avec contrôle total des données par l'utilisateur
- Pas d'envoi de données vers le cloud sans consentement explicite
- Architecture hybride : accessibilité web + sécurité locale

**Scalabilité : Sans Limite**
- Pas de limite technique sur le nombre de biens gérés
- Si volumétrie importante, les stats peuvent être **compilées par villes** au besoin
- Performance reste fluide de 1 à 10+ biens, et au-delà avec agrégation intelligente
- Architecture conçue pour grandir avec le portefeuille de l'utilisateur

**Stabilité et Qualité**
- Application fiable pour gérer des données financières sensibles
- Pas de crash, gestion d'erreur robuste
- Système de sauvegarde et récupération des données

### Measurable Outcomes

**KPIs Utilisateur (Priorité Absolue) :**

1. **KPI 1 : Taux de Mise à Jour Mensuelle**
   - Cible : ≥ 80%
   - Définition : % d'utilisateurs qui enregistrent au moins 1 loyer ou 1 facture par mois
   - Signification : YoyImmo remplace effectivement Excel et devient l'outil quotidien

2. **KPI 2 : Temps de Préparation Fiscale**
   - Cible : < 60 minutes (vs 10-15h avant)
   - Définition : Temps passé de l'ouverture du dashboard fiscal à la génération de l'export complet
   - Signification : Validation du gain de temps, objectif #1 du produit

3. **KPI 3 : Utilisation Dashboard Fiscal**
   - Cible : ≥ 90% lors de la période fiscale (avril-mai)
   - Définition : % d'utilisateurs qui utilisent la fonctionnalité export fiscal lors de leur déclaration
   - Signification : Les utilisateurs font confiance à YoyImmo pour leurs impôts

4. **KPI 4 : Rapidité de Saisie**
   - Cible : Loyer < 10 sec, Facture < 60 sec
   - Définition : Temps moyen pour valider un loyer ou ajouter une facture
   - Signification : L'UX est effectivement simple et fluide

5. **KPI 5 : Efficacité Gestion Impayés**
   - Cible : 0 jour (notification automatique le jour J)
   - Définition : Délai moyen entre date de paiement prévue et détection d'impayé
   - Signification : Plus besoin de suivre manuellement les dates

**KPIs Engagement :**

6. **KPI 6 : Fréquence d'Utilisation Mensuelle**
   - Cible : ≥ 3-4 sessions/mois
   - Signification : YoyImmo est utilisé régulièrement, pas abandonné

7. **KPI 7 : Taux de Rétention à 6 Mois**
   - Cible : ≥ 70%
   - Signification : L'outil résout durablement le problème

**Philosophie de Mesure :**

Le succès de YoyImmo se mesure d'abord à l'aune de l'**impact réel sur la vie quotidienne** des utilisateurs :
- Moins de stress fiscal
- Plus de clarté patrimoniale
- Temps récupéré pour se concentrer sur ce qui compte vraiment

La croissance de la base utilisateurs est un indicateur secondaire bienvenu mais jamais une fin en soi. Un seul utilisateur pleinement satisfait vaut mieux que 100 utilisateurs frustrés.

---

## Product Scope

### MVP - Minimum Viable Product

**Philosophie MVP : Ce qui doit marcher pour être utile**

Le MVP se concentre sur l'essentiel : éliminer le chaos administratif et le stress fiscal des propriétaires.

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
- **Cryptage optionnel** : Documents sensibles peuvent être cryptés à la demande (paramétrage utilisateur)

**6. Interface Web Moderne**
- **Page d'accueil centralisée** : Vue d'ensemble de tous les biens avec statut des loyers
- **Navigation intuitive** : Accès rapide à toutes les fonctionnalités
- **Responsive design** : Utilisable sur desktop et mobile
- **Performance instantanée** : Tout doit sembler instantané (architecture locale)

**Critères de succès MVP :**
- ✅ Enregistrer un loyer en < 10 secondes
- ✅ Ajouter une facture en < 60 secondes
- ✅ Retrouver n'importe quel document en < 10 secondes
- ✅ Dashboard fiscal fournit tous les totaux nécessaires pour la déclaration
- ✅ Rappels automatiques fonctionnent pour tous les biens
- ✅ Application fonctionne de manière fluide de 1 à 10+ biens
- ✅ Utilisateur opérationnel en < 30 minutes

**Hors scope MVP :**
- Import depuis Excel (données trop variables et non standardisées)
- Gestion multi-utilisateurs ou comptes partagés
- Synchronisation cloud ou backup automatique (local-first par design)

### Growth Features (Post-MVP)

**V1.1 : Intelligence Patrimoniale**

**Dashboard de Rentabilité et Performance**
- Métriques de rendement locatif tenant compte du **prix d'achat**
- **Suivi des coûts** : crédits (échéanciers, capital restant dû, intérêts payés) et assurances
- Classement des biens par rentabilité et ROI
- Comparaison de performance entre biens
- Vision globale et drill-down par bien

**Dashboard Fiscal Complet**
- Pré-remplissage intelligent des cases d'impôts spécifiques (2042, 2044)
- Recommandations fiscales contextuelles
- Support des différents régimes fiscaux (micro-foncier, réel simplifié, LMNP, LMP)

**Post-MVP : Automatisation Documentaire**
- Génération automatique de quittances de loyer en PDF
- Templates personnalisables pour documents
- Historique détaillé et visualisations graphiques des évolutions
- Gestion des charges locatives récupérables
- Suivi détaillé des travaux et amortissements

### Vision (Future)

**Intelligence Documentaire : OCR et Automatisation**

**OCR de Précision**
- Extraction automatique des données depuis les factures scannées
- Reconnaissance du type de document (facture, CR de gérance, bail, etc.)
- Routing automatique des documents par bien/groupe
- Gestion des cas complexes : documents composites, factures multiples

**Saisie Automatique avec Traçabilité**
- Interprétation des documents et saisie automatique des informations adéquates
- **Distinction visuelle** : Format différent (couleur de police) pour distinguer les saisies manuelles des saisies automatiques
- **Correction toujours possible** : Toutes données saisies (auto ou manuelles) peuvent être corrigées par l'utilisateur
- Confiance et transparence sur l'origine des données

**Compréhension Contextuelle**
- Extraction de données structurées pour automatisation complète
- Détection d'anomalies et suggestions intelligentes
- Transformation automatique des documents en données exploitables

**Expansion Fonctionnelle**
- Intégration bancaire pour réconciliation automatique
- Compilation par villes si volumétrie importante
- Support multi-propriétés avec agrégation intelligente

**Philosophie de Croissance**

Chaque fonctionnalité future doit **simplifier la vie quotidienne** des propriétaires sans ajouter de complexité à l'interface. YoyImmo doit rester **simple, rapide, et centré sur l'essentiel**, même avec des fonctionnalités avancées.
