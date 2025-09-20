# Developer Note: Feature-Based Architecture Pattern

## Overview

Our Vite-Vue projects follow a **feature-based architecture** where each major UI component or page is organized into self-contained folders. This approach promotes code isolation, reusability, and maintainability by keeping all related functionality together.

## Core Structure

```
src/
├── features/           # ← Feature modules
├── components/         # ← Shared UI components (shadcn-vue)
├── layouts/           # ← Application layouts
├── pages/             # ← Route entry points
├── utils/             # ← Global utilities
└── stores/            # ← Global state management
```

## Feature Folder Pattern

Each feature follows this standardized internal structure:

```
features/
└── featureName/
    ├── featureNameView.vue     # ← Main component (exported to router)
    ├── components/             # ← Feature-specific components
    ├── composables/           # ← Feature-specific logic
    ├── services/              # ← API calls and data fetching
    ├── stores/                # ← Feature-specific state
    ├── utils/                 # ← Feature-specific utilities
    ├── config/                # ← Configuration files
    └── info.md                # ← Feature documentation
```

## Examples by Complexity

### Simple Feature
```
sourcesPanel/
├── sourcesPanelView.vue       # Main view
├── components/                # 2-3 related components
│   ├── CreateSourceDialog.vue
│   └── EditSourceDialog.vue
├── services/
│   └── sources.service.js     # API endpoints
└── stores/
    └── userRoleStore.js       # Feature state
```

### Medium Feature
```
contactsPanel/
├── contactsPanelView.vue      # Main view
├── components/                # Multiple organized components
│   ├── ContactListItem.vue
│   ├── ContactPreviewModal.vue
│   ├── ContactsStats.vue
│   ├── ContactsTableControls.vue
│   ├── CreateContactDialog.vue
│   └── StatusSelect.vue
├── services/                  # Multiple service files
│   ├── contacts.service.js
│   └── stats.service.js
└── stores/
    └── userRoleStore.js
```

### Complex Feature
```
VacancyPanel/
├── VacancyPanelView.vue       # Main view
├── components/                # Nested component organization
│   ├── VacancyControls.vue
│   ├── applicant-table/       # ← Sub-feature grouping
│   │   ├── ApplicantItem.vue
│   │   ├── ApplicantTable.vue
│   │   └── ApplicantsPagination.vue
│   ├── modal-stages/          # ← Modal-specific components
│   │   ├── ColorSelect.vue
│   │   ├── StageForm.vue
│   │   └── StagesModal.vue
│   └── ui/                    # ← Feature-specific UI components
│       └── wrapperTooltip.vue
├── composables/               # Feature logic hooks
│   ├── useVacancyPanel.js
│   ├── useStageHandling.js
│   └── useEditable.js
├── services/                  # Multiple API services
│   ├── vacancy.service.js
│   ├── applicants.service.js
│   └── stages.service.js
├── stores/                    # Multiple state stores
│   ├── useVacancyPanelStore.js
│   ├── useApplicantsPanelStore.js
│   └── useStagesStore.js
├── config/                    # Configuration files
│   ├── customBadges.js
│   └── moduleComponents.js
├── utils/                     # Feature utilities
│   └── date.js
└── info.md                    # Feature documentation
```

## Key Principles

### 1. Encapsulation
Everything related to a feature stays within its folder:
- **Components**: Only used within the feature
- **Services**: Feature-specific API calls
- **Stores**: Feature-specific state management
- **Composables**: Feature-specific reactive logic

### 2. Single Entry Point
The **`featureNameView.vue`** file serves as the main export:
```js
// router/routes.js
import ContactsPanelView from '@/features/contactsPanel/contactsPanelView.vue'

const routes = [
  { path: '/contacts', component: ContactsPanelView }
]
```

### 3. Shared Resources
Global resources live at the top level:
- **UI Components**: `components/ui/` (shadcn-vue)
- **Layouts**: `layouts/`
- **Global Utils**: `utils/`
- **Global Stores**: `stores/`

### 4. Component Organization
For complex features, organize components into logical groups:
```
components/
├── modal-stages/          # Modal-related components
├── applicant-table/       # Table-related components
├── ui/                    # Feature-specific UI components
└── common/                # Shared within feature
```

## Cross-Feature Communication

### Rarely Import Features
Features should be self-contained. Cross-feature imports are **rare** and only for:
- Large or reusable modals
- Complex or shared tabs
- Major widgets

### Documentation Required
When features become complex or reusable, include:
```
features/complexFeature/
├── info.md               # ← Feature documentation
├── rbac.md              # ← Permission requirements
└── examples/            # ← API response examples
```