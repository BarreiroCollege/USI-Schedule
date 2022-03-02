import React from 'react';
import 'antd/dist/antd.css';
import {Col, Layout, Row} from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import iCalendarPlugin from '@fullcalendar/icalendar';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import "./App.css";
import {COLORS} from "./colors";

const SCHEDULES = [
  "https://search.usi.ch/en/educations/30/bachelor-of-science-in-informatics/schedules/52/1",
  "https://search.usi.ch/en/educations/30/bachelor-of-science-in-informatics/schedules/52/2",
  "https://search.usi.ch/en/educations/30/bachelor-of-science-in-informatics/schedules/52/3",
];

const COURSES = [
  {name: "Software Atelier 2", color: -1},
  {name: "Computer Networking", color: -1},
  {name: "Software Atelier 4", color: -1},
  {name: "Machine Learning", color: -1},
  {name: "Theory of Computation", color: -1},
  {name: "Programming Challenges Lab", color: -1},
]

let i = 0;

class App extends React.Component {
  render() {
    return <Layout>
      <Layout.Header/>
      <Layout.Content>
        <Row justify="space-around">
          <Col xs={24} lg={18}>
            <FullCalendar
              viewClassNames={'fc'}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'Schedule,Week,Month'
              }}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, iCalendarPlugin]}
              initialView={window.innerWidth <= 768 ? "Schedule" : "Week"}
              firstDay={1}
              timeZone={"local"}
              nowIndicator={true}
              views={{
                Schedule: {type: 'listWeek', duration: {days: 10}},
                Week: {type: 'timeGridWeek', weekends: false, allDaySlot: false},
                Month: {type: 'dayGridMonth'},
              }}
              slotMinTime={"08:00"}
              slotMaxTime={"19:00"}
              businessHours={[{daysOfWeek: [1, 2, 3, 4, 5], startTime: "08:30", endTime: "18:30"}]}
              eventSources={SCHEDULES.map(s => ({
                url: `https://cors-pc-sdc-gal.herokuapp.com/${s}/ics`,
                format: 'ics'
              }))}
              eventDataTransform={(e) => {
                const c =COURSES.find(c => e.title && e.title.startsWith(c.name));
                if (!c) return {};

                if (c.color === -1) {
                  c.color = i;
                  i++;
                }
                e.color = COLORS[c.color];
                e.title = `[${(e.extendedProps || {location: "?"}).location}] ${e.title}`;
                return e;
              }}
              eventClick={info => {
                info.jsEvent.preventDefault();
                if (info.event.url) window.open(info.event.url, "_blank");
              }}
            />
          </Col>
        </Row>
      </Layout.Content>
      <Layout.Footer/>
    </Layout>;
  }
}

export default App;
