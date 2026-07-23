import type { ModuleKernel } from '../kernel/ModuleKernel'
import type { PlatformModule } from '../contracts/ModuleManifest'

export interface ProductConfig {
  id: string
  name: Record<string, string>
  description: Record<string, string>
  version: string
  slug: string
}

export interface ProductRegistration {
  config: ProductConfig
  permissions?: Array<{ group: string; permissions: string[] }>
  navigation?: Array<{ group: string; items: Array<{ label: string; href: string; icon?: string; permissions?: string[] }> }>
  widgets?: Array<{ id: string; label: string; value: string; icon?: string; color?: string; permission?: string }>
  settings?: Array<{ section: string; label: string; items: Array<{ key: string; label: string; type: string; default?: unknown }> }>
  featureFlags?: Array<{ key: string; label: string; default: boolean; description?: string }>
  seo?: Array<{ route: string; title: string; description: string }>
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
  registerPermissions(permissions: ProductRegistration['permissions']): ProductAPI
  registerNavigation(navigation: ProductRegistration['navigation']): ProductAPI
  registerWidgets(widgets: ProductRegistration['widgets']): ProductAPI
  registerSettings(settings: ProductRegistration['settings']): ProductAPI
  registerFeatureFlags(flags: ProductRegistration['featureFlags']): ProductAPI
  registerSEO(seo: ProductRegistration['seo']): ProductAPI
  registerSearch(search: ProductRegistration['search']): ProductAPI
  registerCommands(commands: string[]): ProductAPI
  registerQueries(queries: string[]): ProductAPI
  registerEvents(events: string[]): ProductAPI
  registerJobs(jobs: string[]): ProductAPI
  registerHealthChecks(checks: ProductRegistration['healthChecks']): ProductAPI
  registerNotificationProviders(providers: string[]): ProductAPI
  build(): PlatformModule
}
