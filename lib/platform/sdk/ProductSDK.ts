import type { PlatformModule } from '../contracts/ModuleManifest'
import type { ModuleKernel } from '../kernel/ModuleKernel'
import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, BarChart3 } from 'lucide-react'

export interface ProductConfig {
  id: string
  name: Record<string, string>
  description: Record<string, string>
  version: string
  slug: string
}

interface NavItemInput {
  label: string
  href: string
  icon?: LucideIcon
  permissions?: string[]
}

interface NavGroupInput {
  group: string
  items: NavItemInput[]
}

interface PermissionInput {
  group: string
  permissions: string[]
}

interface WidgetInput {
  id: string
  label: string
  value: string | number
  icon?: LucideIcon
  color?: string
  permission?: string
}

interface SettingsInput {
  section: string
  items: Array<{ key: string; label: string; type: string; default?: unknown }>
}

interface FeatureFlagInput {
  key: string
  label: string
  default: boolean
  description?: string
}

interface SeoInput {
  route: string
  title: string
  description: string
}

interface ProductRegistration {
  config: ProductConfig
  permissions?: PermissionInput[]
  navigation?: NavGroupInput[]
  widgets?: WidgetInput[]
  settings?: SettingsInput[]
  featureFlags?: FeatureFlagInput[]
  seo?: SeoInput[]
  search?: Array<{ moduleId: string }>
  commands?: string[]
  queries?: string[]
  events?: string[]
  jobs?: string[]
  healthChecks?: Array<{ id: string; label: string }>
  notificationProviders?: string[]
}

export interface ProductAPI {
  config: ProductConfig
  registerPermissions(permissions: PermissionInput[]): ProductAPI
  registerNavigation(navigation: NavGroupInput[]): ProductAPI
  registerWidgets(widgets: WidgetInput[]): ProductAPI
  registerSettings(settings: SettingsInput[]): ProductAPI
  registerFeatureFlags(flags: FeatureFlagInput[]): ProductAPI
  registerSEO(seo: SeoInput[]): ProductAPI
  registerSearch(search: Array<{ moduleId: string }>): ProductAPI
  registerCommands(commands: string[]): ProductAPI
  registerQueries(queries: string[]): ProductAPI
  registerEvents(events: string[]): ProductAPI
  registerJobs(jobs: string[]): ProductAPI
  registerHealthChecks(checks: Array<{ id: string; label: string }>): ProductAPI
  registerNotificationProviders(providers: string[]): ProductAPI
  build(): PlatformModule
}

export function createProduct(config: ProductConfig): ProductAPI {
  const registration: ProductRegistration = { config }

  const api: ProductAPI = {
    config,

    registerPermissions(permissions) {
      registration.permissions = permissions
      return api
    },

    registerNavigation(navigation) {
      registration.navigation = navigation
      return api
    },

    registerWidgets(widgets) {
      registration.widgets = widgets
      return api
    },

    registerSettings(settings) {
      registration.settings = settings
      return api
    },

    registerFeatureFlags(flags) {
      registration.featureFlags = flags
      return api
    },

    registerSEO(seo) {
      registration.seo = seo
      return api
    },

    registerSearch(search) {
      registration.search = search
      return api
    },

    registerCommands(commands) {
      registration.commands = commands
      return api
    },

    registerQueries(queries) {
      registration.queries = queries
      return api
    },

    registerEvents(events) {
      registration.events = events
      return api
    },

    registerJobs(jobs) {
      registration.jobs = jobs
      return api
    },

    registerHealthChecks(checks) {
      registration.healthChecks = checks
      return api
    },

    registerNotificationProviders(providers) {
      registration.notificationProviders = providers
      return api
    },

    build(): PlatformModule {
      return {
        manifest: {
          id: config.id,
          name: config.name,
          description: config.description,
          version: config.version,
          slug: config.slug,
          enabled: true,
          order: 10,
        },
        register(kernel: ModuleKernel) {
          applyRegistration(kernel, registration)
        },
      }
    },
  }

  return api
}

function applyRegistration(kernel: ModuleKernel, reg: ProductRegistration): void {
  const registries = kernel.getRegistries()

  if (reg.permissions) {
    for (const pg of reg.permissions) {
      registries.permissions.registerPermissions(reg.config.id, pg.group, pg.permissions)
    }
  }

  if (reg.navigation) {
    for (const ng of reg.navigation) {
      registries.navigation.registerGroup({
        id: `${reg.config.id}-${ng.group}`,
        labelEn: ng.group,
        labelAr: ng.group,
        moduleId: reg.config.id,
        order: 10,
        items: ng.items.map(item => ({
          href: item.href,
          labelEn: item.label,
          labelAr: item.label,
          icon: item.icon ?? LayoutDashboard,
          permission: item.permissions?.[0],
          moduleId: reg.config.id,
        })),
      })
    }
  }

  if (reg.widgets) {
    for (const w of reg.widgets) {
      registries.widgets.registerWidget({
        id: w.id,
        moduleId: reg.config.id,
        title: w.label,
        value: w.value,
        icon: w.icon ?? BarChart3,
        color: w.color,
        permission: w.permission,
        order: 10,
      })
    }
  }

  if (reg.settings) {
    for (const s of reg.settings) {
      registries.settings.registerSection({
        id: `${reg.config.id}-${s.section}`,
        moduleId: reg.config.id,
        labelEn: s.section,
        labelAr: s.section,
        order: 10,
        keys: s.items.map(item => item.key),
      })
    }
  }

  if (reg.featureFlags) {
    for (const f of reg.featureFlags) {
      registries.featureFlags.registerFlag({
        key: `${reg.config.id}.${f.key}`,
        moduleId: reg.config.id,
        labelEn: f.label,
        labelAr: f.label,
        defaultValue: f.default,
      })
    }
  }

  if (reg.seo) {
    for (const s of reg.seo) {
      registries.seo.registerContribution({
        moduleId: reg.config.id,
        routePattern: s.route,
        titleEn: s.title,
        titleAr: s.title,
        descriptionEn: s.description,
        descriptionAr: s.description,
      })
    }
  }

  const container = kernel.getContainer()
  if (container.has('searchEngine') && reg.search) {
    const searchEngine = container.resolve<any>('searchEngine')
    for (const s of reg.search) {
      searchEngine.registerModuleProvider(s.moduleId, {
        search: async () => ({ documents: [], total: 0, page: 1, perPage: 10, totalPages: 0, query: '', duration: 0 }),
        index: async () => {},
        update: async () => {},
        delete: async () => {},
        clear: async () => {},
        isAvailable: () => true,
      })
    }
  }
}
