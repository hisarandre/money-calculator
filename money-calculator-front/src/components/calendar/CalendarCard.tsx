import CardCustom from "@/components/CardCustom.tsx";
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

const CalendarCard = () => {

    return (
        <CardCustom title="Calendar" description="Display the expenses per day"
                    className="col-span-2 row-span-2">
            <FullCalendar
                plugins={[ dayGridPlugin, interactionPlugin ]}
                initialView="dayGridMonth"
                events={[
                    { title: 'event 1', date: '2024-11-01', display: 'background' },
                    { title: 'event 2', date: '2024-11-26', display: 'background' }
                ]}
            />
        </CardCustom>
    )
}

export default CalendarCard;