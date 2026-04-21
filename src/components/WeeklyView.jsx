
import React from 'react';

const WeeklyView = ({ events }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i); // Covers 12 AM to 11 PM
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const getWeekDays = () => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();

  const getEventsForHour = (day, hour) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const eventHour = parseInt(event.time.split(':')[0]);
      return eventDate.toDateString() === day.toDateString() && eventHour === hour;
    });
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'deadline':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'start_time':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      default:
        return 'bg-neutral-500/20 border-neutral-500/30 text-neutral-300';
    }
  };


  return (
    <div className="grid grid-cols-8 h-[700px] overflow-y-auto">
      {/* Time column */}
      <div className="col-span-1">
        {hours.map(hour => (
          <div key={hour} className="h-16 border-b border-neutral-800/50 p-2 text-right text-xs text-neutral-500">
            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
          </div>
        ))}
      </div>

      {/* Day columns */}
      {weekDays.map((day, i) => (
        <div key={i} className="col-span-1 border-r border-neutral-800/50">
          {hours.map(hour => {
            const hourEvents = getEventsForHour(day, hour);
            return (
              <div key={hour} className="h-16 border-b border-neutral-800/50 p-1 relative flex flex-col gap-1 overflow-y-auto">
                {hourEvents.map((evt, idx) => (
                  <div key={idx} className={`rounded p-1 text-[10px] sm:text-xs overflow-hidden leading-tight shrink-0 ${getEventColor(evt.type)}`}>
                    <div className="font-semibold block sm:inline mr-1">{evt.time}</div>
                    <div className="truncate inline">{evt.title}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeeklyView;
