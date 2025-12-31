# Frontend: Organization Multi-Tenancy

## Components

### OrganizationSwitcher.tsx
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Organization {
  id: string;
  name: string;
  role: string;
}

export function OrganizationSwitcher({ 
  organizations, 
  currentOrgId 
}: { 
  organizations: Organization[];
  currentOrgId: string;
}) {
  const router = useRouter();
  const [selectedOrg, setSelectedOrg] = useState(currentOrgId);

  const handleChange = (orgId: string) => {
    setSelectedOrg(orgId);
    // Store in localStorage or context
    localStorage.setItem('currentOrgId', orgId);
    router.refresh();
  };

  return (
    <select value={selectedOrg} onChange={(e) => handleChange(e.target.value)}>
      {organizations.map(org => (
        <option key={org.id} value={org.id}>
          {org.name} ({org.role})
        </option>
      ))}
    </select>
  );
}
```

## Hooks

### useCurrentOrganization.ts
```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useCurrentOrganization() {
  const [orgId, setOrgId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const stored = localStorage.getItem('currentOrgId');
    if (stored) {
      setOrgId(stored);
    } else {
      // Get user's first organization
      supabase
        .from('org_memberships')
        .select('org_id')
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data) {
            setOrgId(data.org_id);
            localStorage.setItem('currentOrgId', data.org_id);
          }
        });
    }
  }, [supabase]);

  return orgId;
}
```
