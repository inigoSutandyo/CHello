import moment from 'moment'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCardCalendar } from '../../../controller/CardController'
import {Calendar, momentLocalizer} from "react-big-calendar";
import { LoadingComponent } from '../../components/LoadingComponent';
import { FaArrowLeft } from 'react-icons/fa';
import "react-big-calendar/lib/css/react-big-calendar.css";

export const CalendarPage = ({userId}) => {
  const { boardId } = useParams();
 
  const events = useCardCalendar(boardId, userId)
  const navigate = useNavigate();

  const localizer = momentLocalizer(moment)
  return (
    <div className='m-3'>
        <div className="d-flex justify-content-start">
            <div
              className="m-2"
              onClick={() => {
                navigate(-1);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <FaArrowLeft />
            </div>
        </div>
        {events ? (
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 700 }}
                />
            </div>
        ) : <LoadingComponent/>}

    </div>
  )
}
