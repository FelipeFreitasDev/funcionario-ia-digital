/**
 * Cache Helper para Imagens Geradas
 * Armazena imagens em memória com TTL configurável
 * Em produção, pode ser substituído por Redis
 */

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

export interface CacheConfig {
  ttl: number; // em segundos
  maxSize: number; // máximo de entradas
}

class ImageCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig = {
    ttl: 3600, // 1 hora por padrão
    maxSize: 100, // máximo 100 imagens em cache
  };

  /**
   * Gera chave de cache baseada em parâmetros
   */
  private generateKey(
    prompt: string,
    style: string,
    width: number,
    height: number,
    provider: string
  ): string {
    return `img:${provider}:${style}:${width}x${height}:${Buffer.from(prompt).toString("base64").substring(0, 50)}`;
  }

  /**
   * Obtém imagem do cache
   */
  get<T>(
    prompt: string,
    style: string,
    width: number,
    height: number,
    provider: string
  ): T | null {
    const key = this.generateKey(prompt, style, width, height, provider);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Verificar se expirou
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Armazena imagem no cache
   */
  set<T>(
    prompt: string,
    style: string,
    width: number,
    height: number,
    provider: string,
    data: T,
    ttl?: number
  ): void {
    const key = this.generateKey(prompt, style, width, height, provider);

    // Limpar cache se atingir limite
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].createdAt - b[1].createdAt
      )[0]?.[0];

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const expiresAt = Date.now() + (ttl || this.config.ttl) * 1000;

    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: Date.now(),
    });
  }

  /**
   * Limpa cache expirado
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): {
    size: number;
    maxSize: number;
    ttl: number;
    entries: number;
  } {
    this.cleanup();
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl,
      entries: this.cache.size,
    };
  }

  /**
   * Configura TTL padrão
   */
  setTTL(ttl: number): void {
    this.config.ttl = ttl;
  }

  /**
   * Configura tamanho máximo do cache
   */
  setMaxSize(maxSize: number): void {
    this.config.maxSize = maxSize;
  }
}

// Singleton instance
export const imageCache = new ImageCache();

/**
 * Helper para cachear resultado de geração de imagem
 */
export function cacheImageResult<T>(
  prompt: string,
  style: string,
  width: number,
  height: number,
  provider: string,
  result: T,
  ttl?: number
): void {
  imageCache.set(prompt, style, width, height, provider, result, ttl);
}

/**
 * Helper para obter imagem cacheada
 */
export function getCachedImage<T>(
  prompt: string,
  style: string,
  width: number,
  height: number,
  provider: string
): T | null {
  return imageCache.get(prompt, style, width, height, provider);
}

/**
 * Limpar cache periodicamente (a cada 30 minutos)
 */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    imageCache.cleanup();
  }, 30 * 60 * 1000);
}
