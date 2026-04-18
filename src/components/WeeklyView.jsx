
import React from 'react';

const WeeklyView = ({ events }) => {
  const hours = Array.from({ length: 17 }, (_, i) => i + 7); // Starts at 7am, ends at midnight
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date('2023-10-23T00:00:00'); // Mock today's date

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

  const getEventForHour = (day, hour) => {
    const date = new Date(day);
    const dateString = date.toISOString().split('T')[0];
    const hourString = `${hour.toString().padStart(2, '0')}:00`;

    return events.find(event => {
      const eventDate = new Date(event.date);
      const eventDateString = eventDate.toISOString().split('T')[0];
      const eventHour = parseInt(event.time.split(':')[0]);
      return eventDateString === dateString && eventHour === hour;
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
          {hours.map(hour => (
            <div key={hour} className="h-16 border-b border-neutral-800/50 p-1 relative">
              {getEventForHour(day, hour) && (
                <div className={`absolute inset-0 m-1 rounded p-1 text-[10px] truncate ${getEventColor(getEventForHour(day, hour).type)}`}>
                  {getEventForHour(day, hour).title}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeeklyView;
