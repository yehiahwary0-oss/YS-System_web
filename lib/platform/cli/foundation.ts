export type CliCommandCategory = 'make' | 'generate' | 'inspect' | 'manage' | 'debug'

export interface CliCommandDefinition {
  signature: string
  description: string
  category: CliCommandCategory
  arguments: Array<{ name: string; description: string; required: boolean }>
  options: Array<{ name: string; description: string; type: 'string' | 'boolean' | 'number'; default?: unknown }>
  handler?: string
  moduleId?: string
  future: boolean
}

export const platformCliCommands: CliCommandDefinition[] = [
  {
    signature: 'make:module {name} {slug}',
    description: 'Generate a new module scaffold with all features',
    category: 'make',
    arguments: [
      { name: 'name', description: 'Module display name', required: true },
      { name: 'slug', description: 'Module slug identifier', required: true },
    ],
    options: [
      { name: 'description', description: 'Module description', type: 'string', default: '' },
      { name: 'features', description: 'Comma-separated feature list', type: 'string', default: 'all' },
    ],
    handler: 'generator/module',
    future: true,
  },
  {
    signature: 'make:page {name} {path}',
    description: 'Generate a new admin page',
    category: 'make',
    arguments: [
      { name: 'name', description: 'Page display name', required: true },
      { name: 'path', description: 'URL path', required: true },
    ],
    options: [
      { name: 'module', description: 'Parent module', type: 'string' },
    ],
    handler: 'generator/page',
    future: true,
  },
  {
    signature: 'make:widget {name} {id}',
    description: 'Generate a new dashboard widget',
    category: 'make',
    arguments: [
      { name: 'name', description: 'Widget display name', required: true },
      { name: 'id', description: 'Widget identifier', required: true },
    ],
    options: [],
    handler: 'generator/widget',
    future: true,
  },
  {
    signature: 'make:permission {key}',
    description: 'Generate a new permission key',
    category: 'make',
    arguments: [
      { name: 'key', description: 'Permission key', required: true },
    ],
    options: [
      { name: 'module', description: 'Module ID', type: 'string' },
      { name: 'group', description: 'Permission group', type: 'string' },
    ],
    handler: 'generator/permission',
    future: true,
  },
  {
    signature: 'make:event {name}',
    description: 'Generate a new event class',
    category: 'make',
    arguments: [
      { name: 'name', description: 'Event name', required: true },
    ],
    options: [
      { name: 'module', description: 'Module ID', type: 'string' },
    ],
    handler: 'generator/event',
    future: true,
  },
  {
    signature: 'make:command {name}',
    description: 'Generate a new command with handler',
    category: 'make',
    arguments: [
      { name: 'name', description: 'Command name', required: true },
    ],
    options: [
      { name: 'module', description: 'Module ID', type: 'string' },
    ],
    handler: 'generator/command',
    future: true,
  },
  {
    signature: 'make:query {name}',
    description: 'Generate a new query with handler',
    category: 'make',
    arguments: [
      { name: 'name', description: 'Query name', required: true },
    ],
    options: [
      { name: 'module', description: 'Module ID', type: 'string' },
    ],
    handler: 'generator/query',
    future: true,
  },
  {
    signature: 'make:driver {category} {name}',
    description: 'Generate a new driver scaffold',
    category: 'make',
    arguments: [
      { name: 'category', description: 'Driver category (cache, storage, mail, search)', required: true },
      { name: 'name', description: 'Driver name', required: true },
    ],
    options: [
      { name: 'module', description: 'Module ID', type: 'string' },
    ],
    handler: 'generator/driver',
    future: true,
  },
  {
    signature: 'inspect:modules',
    description: 'List all registered modules with their status',
    category: 'inspect',
    arguments: [],
    options: [],
    handler: 'inspector/modules',
    future: true,
  },
  {
    signature: 'inspect:registries',
    description: 'Inspect all registries and their contents',
    category: 'inspect',
    arguments: [],
    options: [
      { name: 'registry', description: 'Filter by registry name', type: 'string' },
    ],
    handler: 'inspector/registries',
    future: true,
  },
  {
    signature: 'inspect:services',
    description: 'List all registered services in the container',
    category: 'inspect',
    arguments: [],
    options: [],
    handler: 'inspector/services',
    future: true,
  },
  {
    signature: 'inspect:drivers',
    description: 'List all registered drivers by category',
    category: 'inspect',
    arguments: [],
    options: [
      { name: 'category', description: 'Filter by driver category', type: 'string' },
    ],
    handler: 'inspector/drivers',
    future: true,
  },
  {
    signature: 'manage:module {action} {module}',
    description: 'Enable, disable, or remove a module',
    category: 'manage',
    arguments: [
      { name: 'action', description: 'enable, disable, remove', required: true },
      { name: 'module', description: 'Module ID', required: true },
    ],
    options: [],
    handler: 'manager/module',
    future: true,
  },
  {
    signature: 'debug:health',
    description: 'Run all health checks and display results',
    category: 'debug',
    arguments: [],
    options: [],
    handler: 'debug/health',
    future: true,
  },
  {
    signature: 'debug:events',
    description: 'Display event bus history',
    category: 'debug',
    arguments: [],
    options: [
      { name: 'limit', description: 'Max events to show', type: 'number', default: 20 },
    ],
    handler: 'debug/events',
    future: true,
  },
  {
    signature: 'debug:metrics',
    description: 'Display performance metrics',
    category: 'debug',
    arguments: [],
    options: [
      { name: 'name', description: 'Filter by metric name', type: 'string' },
    ],
    handler: 'debug/metrics',
    future: true,
  },
]

export function getCliCommandsByCategory(category: CliCommandCategory): CliCommandDefinition[] {
  return platformCliCommands.filter(c => c.category === category)
}

export function findCliCommand(signature: string): CliCommandDefinition | undefined {
  return platformCliCommands.find(c => c.signature.startsWith(signature))
}
