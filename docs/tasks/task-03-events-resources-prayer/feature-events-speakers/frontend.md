# Frontend: Events & Speakers

## Components

### EventCard.tsx
```typescript
'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Event } from '@/types';

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="card">
        <h3>{event.title}</h3>
        <p>{format(new Date(event.starts_at), 'MMM d, yyyy h:mm a')}</p>
        {event.speaker && <p>Speaker: {event.speaker.name}</p>}
      </div>
    </Link>
  );
}
```

### AddToCalendar.tsx
```typescript
'use client';

import { Event } from '@/types';

export function AddToCalendar({ event }: { event: Event }) {
  const generateICS = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(event.starts_at)}`,
      `DTEND:${formatICSDate(event.ends_at)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title}.ics`;
    link.click();
  };

  return (
    <button onClick={generateICS}>
      Add to Calendar
    </button>
  );
}

function formatICSDate(date: string): string {
  return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
```
