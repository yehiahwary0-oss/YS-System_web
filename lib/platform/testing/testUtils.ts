import { ModuleKernel } from '../kernel/ModuleKernel'
import { ServiceContainer } from '../services/ServiceContainer'
import { EventBus } from '../services/EventBus'
import { Logger, createConsoleTransport } from '../services/Logger'
import { PlatformConfig } from '../services/PlatformConfig'
import { CacheManager } from '../cache/CacheManager'
import { MemoryDriver } from '../cache/drivers/MemoryDriver'

export function createTestKernel(): ModuleKernel {
  const kernel = new ModuleKernel()
  return kernel
}

export function createTestContainer(): ServiceContainer {
  const container = new ServiceContainer()
  container.singleton('logger', () => {
    const logger = new Logger()
    logger.addTransport(createConsoleTransport())
    return logger
  })
  container.singleton('config', () => new PlatformConfig())
  container.singleton('eventBus', () => new EventBus())
  container.singleton('cacheManager', () => new CacheManager(new MemoryDriver()))
  return container
}

export function createMockEventBus(): EventBus {
  return new EventBus()
}

export function waitForCondition(condition: () => boolean, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const check = () => {
      if (condition()) return resolve()
      if (Date.now() - start >= timeout) return reject(new Error('Timeout waiting for condition'))
      setTimeout(check, 10)
    }
    check()
  })
}

export function createTimedPromise<T>(result: T, delay = 100): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(result), delay))
}
