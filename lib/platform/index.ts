export { ModuleKernel } from './kernel/ModuleKernel'
export { bootstrapPlatform, getKernel } from './bootstrap'
export { PlatformProvider, usePlatform } from './PlatformProvider'

export type { ModuleManifest, PlatformModule, Dependency, SetupResult, PluginConfig, PluginFoundation } from './contracts/ModuleManifest'
export type { NavItem, NavGroup } from './registries/NavigationRegistry'
export type { PermissionDefinition, PermissionGroup } from './registries/PermissionRegistry'
export type { WidgetDefinition } from './registries/WidgetRegistry'
export type { SettingsSection } from './registries/SettingsRegistry'
export type { SearchProvider } from './registries/SearchRegistry'
export type { SeoContribution } from './registries/SeoRegistry'
export type { FeatureFlagDefinition } from './registries/FeatureFlagRegistry'
export type { ScheduledTask, TaskExecution } from './registries/SchedulerRegistry'

export type { LogLevel, LogEntry } from './services/Logger'
export type { ConfigValue, ConfigValidationError } from './services/PlatformConfig'
export type { EventHandler } from './services/EventBus'
export type { NotificationChannel, Notification, NotificationProvider, NotificationResult } from './services/NotificationBus'
export type { AuditEntry, AuditAction } from './services/AuditEngine'
export type { HealthStatus, HealthCheck, HealthReport, HealthCheckResult } from './services/HealthReporter'
export type { Metric, MetricSummary } from './services/PerformanceMonitor'
export type { PermissionCheck, RoleDefinition } from './services/SecurityManager'

export type { FlagConditionType, FlagCondition, FeatureFlag, FeatureFlagEngineContext } from './engine/FeatureFlagEngine'
export type { ValidationError, GraphNode } from './engine/DependencyGraph'

export type { AdapterState, AdapterInfo } from './adapters/AdapterState'

export type { Command, CommandHandler, Query, QueryHandler, BusMiddleware, BusResult, DispatchOptions } from './bus/types'
export { CommandBus } from './bus/CommandBus'
export { QueryBus } from './bus/QueryBus'
export { MiddlewarePipeline } from './bus/MiddlewarePipeline'
export { createLoggingMiddleware, createMetricsMiddleware, createPermissionMiddleware, createValidationMiddleware, createFeatureFlagMiddleware, createRateLimitMiddleware } from './bus/MiddlewarePipeline'

export type { CacheDriver, CacheStats, TaggedCache } from './cache/types'
export { CacheManager } from './cache/CacheManager'
export { MemoryDriver } from './cache/drivers/MemoryDriver'
export { NullDriver } from './cache/drivers/NullDriver'

export type { StorageDriver, FileVisibility, StorageConfig } from './storage/types'
export { StorageManager } from './storage/StorageManager'
export { LocalDriver } from './storage/drivers/LocalDriver'

export type { MailDriver, MailMessage, MailAddress, MailAttachment } from './mail/types'
export { MailManager } from './mail/MailManager'
export { SmtpDriver } from './mail/drivers/SmtpDriver'

export type { SearchDriver, SearchParams, SearchResult, SearchDocument, SearchFilters } from './search/types'
export { SearchEngine } from './search/SearchEngine'
export { DatabaseDriver } from './search/drivers/DatabaseDriver'

export type { ProductConfig, ProductRegistration, ProductAPI } from './sdk/types'
export { createProduct } from './sdk/ProductSDK'

export type { GeneratorInput, GeneratorFeatures, GeneratedModule } from './generator/types'
export { ModuleGenerator } from './generator/ModuleGenerator'

export type { DriverCategory, DriverInfo } from './drivers/DriverRegistry'
export { DriverRegistry } from './drivers/DriverRegistry'

export type { CliCommandCategory, CliCommandDefinition } from './cli/foundation'
export { platformCliCommands, getCliCommandsByCategory, findCliCommand } from './cli/foundation'

export { useModule, usePermissions, useFeatureFlags, useCommands, useQueries, useCache, useStorage, useNotifications, useEvents } from './hooks'

export type { ExecutionMetric } from './observability/ObservabilityManager'
export { ObservabilityManager } from './observability/ObservabilityManager'

export type { PlatformManifestData } from './manifest/PlatformManifest'
export { PlatformManifest } from './manifest/PlatformManifest'

export type { RuntimeInspection } from './inspector/RuntimeInspector'
export { RuntimeInspector } from './inspector/RuntimeInspector'

export type { PlatformSnapshot } from './snapshot/types'
export { SnapshotGenerator } from './snapshot/SnapshotGenerator'

export type { ErrorSeverity, ErrorCodeEntry, CodedError } from './errors/types'
export { ErrorCatalog, defaultErrorCodes } from './errors/ErrorCatalog'

export type { LifecycleStage, LifecycleTransition, LifecycleError } from './lifecycle/types'
export { LifecycleMonitor } from './lifecycle/LifecycleMonitor'

export type { ValidationVerdict, ValidationCheck, ValidationReport, ExtensionProposal } from './validator/types'
export { ExtensionValidator } from './validator/ExtensionValidator'

export type { CompatibilityStatus, CompatibilityCheck, CompatibilityMatrix } from './compatibility/CompatibilityEngine'
export { CompatibilityEngine } from './compatibility/CompatibilityEngine'

export type { ConfigEntryView, ConfigurationView } from './config/ConfigurationInspector'
export { ConfigurationInspector } from './config/ConfigurationInspector'

export type { ServiceNode, ServiceGraphData } from './graph/ServiceGraph'
export { ServiceGraph } from './graph/ServiceGraph'

export type { ReportSection, PlatformReportData } from './reports/PlatformReport'
export { PlatformReport } from './reports/PlatformReport'

export type { AuditFinding, AuditReport } from './audit/PlatformAudit'
export { PlatformAudit } from './audit/PlatformAudit'

export type { HealthScore, OperationalHealthReport } from './health/OperationalHealthCenter'
export { OperationalHealthCenter } from './health/OperationalHealthCenter'

export type { EnvironmentName, EnvVariableDefinition, EnvValidationIssue, EnvValidationReport } from './environment/types'
export { EnvironmentManager } from './environment/EnvironmentManager'

export type { SecretProvider, SecretDefinition, SecretEntry } from './secrets/types'
export { SecretsManager } from './secrets/SecretsManager'

export type { EndpointType, HealthEndpointResponse, HealthEndpointCheck, HealthCheckFn } from './health-endpoints/types'
export { HealthEndpointProvider } from './health-endpoints/HealthEndpointProvider'

export type { ReleaseStatus, ReleaseEntry, ReleaseMigration } from './release/types'
export { ReleaseManager } from './release/ReleaseManager'

export type { RecoveryStatus, RecoveryPlan, RecoveryPlanStep, RecoveryExecution, BackupVerification } from './recovery/types'
export { RecoveryManager } from './recovery/RecoveryManager'

export type { InstallStep, InstallStatus, InstallState, InstallData } from './installer/types'
export { InstallationWizard } from './installer/InstallationWizard'

export type { SecurityFinding } from './reviews/SecurityReview'
export { SecurityReview } from './reviews/SecurityReview'
export type { PerformanceFinding } from './reviews/PerformanceReview'
export { PerformanceReview } from './reviews/PerformanceReview'
