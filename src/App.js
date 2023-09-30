import React, { useState, useEffect} from 'react';
import "./index.css";
import "./main.css";

import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin from '@fullcalendar/interaction';
// import timeGridPlugin from "@fullcalendar/timegrid";
import '@fullcalendar/core/locales/pl'; // Import the Polish locale

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

// import events from "./events";


function generateEvents(currentDate = new Date(), current_body_surface = 1) {
  const events = [];

  const mg40 = 27;
  const mg30 = mg40+7;
  const mg20 = mg30+7;
  const mg10 = mg20+7;
  const mg5 = mg10+7;
  const body_surface = current_body_surface;
  for (let i = 0; i <= mg5; i=i+2) {
    const eventDate = new Date(currentDate);
    eventDate.setDate(currentDate.getDate() + i + 1);

    var dose = 1;

    if (i <= mg40){
      dose = body_surface * 40;
      
    }else 
    if (i <= mg30){
      dose = body_surface * 30;
    }
    else 
    if (i <= mg20){
      dose = body_surface * 20;
    }else
    if (i <= mg10){
      dose = body_surface * 10;
    }
    else 
    if (i <= mg5){
      dose = body_surface *5;
    }

    if (dose < 2.5){
      dose = 2.5;
    }else if (dose < 6){
      dose = 5;
    }else if (dose < 8){
      dose = 7.5;
    }else if (dose < 11){
      dose = 10;
    }else{
      dose = Math.round(dose / 2.5) * 2.5;
    }
    const event = {
      title: `${dose} mg`,
      start: eventDate.toISOString().substring(0, 10), // Format as YYYY-MM-DD
    };
    events.push(event);
  }

  return events;
}



export default function App() {
  useEffect(() => {
    document.title = 'Kalkulator Enkortonu'; // Set the title when the component mounts
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [sliderValue, setSliderValue] = useState(1);
  const [events, setEvents] = useState(generateEvents(currentDate, sliderValue));

  const handleDateClick = (info) => {
    setCurrentDate(info.date);
    setEvents(generateEvents(info.date, sliderValue));
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    setEvents(generateEvents(currentDate, value));
  };

  const printStyles = `
    @media print {
      .fc-view-container {
        overflow: visible !important;
        height: auto !important;
      }
    }
  `;
  return (
    <div  className="App">
    <div><h1>Kalkulator Enkortonu</h1></div>
    <div>
      <Slider
        min={0.1}
        max={2}
        step={0.01}
        value={sliderValue}
        onChange={handleSliderChange}
      />
      <p>Powierzchnia ciała: {sliderValue}</p>
    </div>
    <div>
    <style>{printStyles}</style>
      <FullCalendar
        initialView="multiMonthYear"
        themeSystem="Simplex"
        // validRange={{ start: currentDate, end: nextSixMonths }}
        plugins={[multiMonthPlugin, interactionPlugin]}
        events={events}
        dateClick={handleDateClick}
        stickyFooterScrollbar={false}
        locales="pl" // Set the Polish locale
        locale="pl"
        // height={2000}
        // multiMonthMaxColumns={4} // force a single column
      />
    </div>
    </div>
  );
}
