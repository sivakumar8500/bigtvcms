# Module Template - BigTVCMS

Every new feature module created in `src/modules/[module_name]` must follow this blueprint structure.

---

## Directory Blueprint

```
src/modules/[module_name]/
├── components/          # Reusable UI widgets and presentation modules
├── pages/               # Module level view assemblies and dashboards
├── hooks/               # State controllers and layout adapters
├── services/            # Application use-case coordinators
├── repositories/        # Repository implementations mapping to ApiClient
├── application/         # Zustand Stores and TanStack Query hooks
├── domain/              # Validation Schemas (Zod), entities, interfaces
├── validators/          # Input schema validations
├── dto/                 # DTO definitions
├── mapper/              # Mapping logic from DTO -> Domain Entity
├── constants/           # Module specific static settings
├── types/               # local TypeScript structures
├── routes/              # Client side routing paths
├── tests/               # Unit, integration, and service tests
└── README.md            # Local module developer manual
```

---

## Creation Walkthroughs

### 1. How to Create a New Hook
Create hooks inside `hooks/` to isolate state mapping:
```typescript
import { useState } from 'react';

export function useNewsAction() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
}
```

### 2. How to Create a Repository
Implement interfaces defined inside `domain/`:
```typescript
import { ApiClient } from '@/core/api/api-client';
import { INewsRepository } from '../domain/news.repository.interface';
import { NewsArticle } from '../domain/news.model';
import { NewsArticleDto } from '../dto/news.dto';
import { NewsMapper } from '../mapper/news.mapper';

export class NewsRepository implements INewsRepository {
  constructor(private apiClient: ApiClient) {}

  async getById(id: string): Promise<NewsArticle> {
    const raw = await this.apiClient.get<NewsArticleDto>(`/news/${id}`);
    return NewsMapper.toDomain(raw);
  }
}
```

### 3. How to Create a Mapper
Mappers convert raw API responses (DTOs) into clean Domain formats:
```typescript
import { NewsArticleDto } from '../dto/news.dto';
import { NewsArticle } from '../domain/news.model';

export class NewsMapper {
  public static toDomain(dto: NewsArticleDto): NewsArticle {
    return {
      id: dto.id,
      title: dto.title,
      content: dto.body,
      createdAt: new Date(dto.created_at),
    };
  }
}
```

---

## Module Definition of Done (DoD)
- [ ] Every component has a corresponding test mapping.
- [ ] Code coverage is evaluated and exceeds 80%.
- [ ] All network operations are stubbed using Mock Service Worker (MSW) handlers in `tests/`.
- [ ] Zod schema validation is defined for dynamic network interfaces.
