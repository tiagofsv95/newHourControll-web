import React, { useState, useCallback, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';
import { subSeconds, isBefore } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import { Progress } from 'semantic-ui-react';

import { Container, JobTime, LunchTime, ProgressBar } from './styles';

const DailyProgress: React.FC = () => {
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<Date | null>(null);
  const [finished, setFinished] = useState(false);
  const [startLunchTime, setStartLunchTime] = useState<Date | null>(null);
  const [endLunchTime, setEndLunchTime] = useState<Date | null>(null);
  const [timeLunch, setTimeLunch] = useState<Date | null>(null);
  const [progessPercent, setProgessPercent] = useState(0);

  const handleChangeStartDateTime = useCallback(
    (date: Date | null) => {
      const startDate = date;

      // eslint-disable-next-line no-unused-expressions
      startDate?.setSeconds(0);

      setStartDateTime(startDate);

      if (date) {
        const endHour =
          date.getHours() + 8 + (timeLunch ? timeLunch.getHours() : 0);
        const endMinutes =
          date.getMinutes() + (timeLunch ? timeLunch.getMinutes() : 0);

        const endDate = new Date();
        endDate.setHours(endHour);
        endDate.setMinutes(endMinutes);
        endDate.setSeconds(0);

        setEndDateTime(endDate);

        const atual = new Date();
        atual.setHours(endHour - new Date().getHours());
        atual.setMinutes(endMinutes - new Date().getMinutes());
        atual.setSeconds(0);

        setTimeLeft(atual);
      }
    },
    [setStartDateTime, timeLunch],
  );

  const handleChangeStartLunchTime = useCallback(
    (date: Date | null) => {
      if (endLunchTime && date && isBefore(endLunchTime, date)) {
        setStartLunchTime(null);
        setTimeLunch(null);
        return;
      }

      if (endLunchTime && date) {
        const lunchDate = new Date();
        lunchDate.setHours(endLunchTime.getHours() - date.getHours());
        lunchDate.setMinutes(endLunchTime.getMinutes() - date.getMinutes());
        lunchDate.setSeconds(0);

        setTimeLunch(lunchDate);

        if (endDateTime) {
          const endDate = endDateTime;
          endDate.setHours(endDateTime.getHours() + lunchDate.getHours());
          endDate.setMinutes(endDateTime.getMinutes() + lunchDate.getMinutes());

          setEndDateTime(endDate);

          const atual = new Date();
          atual.setHours(endDate.getHours() - new Date().getHours());
          atual.setMinutes(endDate.getMinutes() - new Date().getMinutes());
          atual.setSeconds(0);

          setTimeLeft(atual);
        }
      }

      setStartLunchTime(date);
    },
    [endLunchTime, endDateTime],
  );

  const handleChangeEndLunchTime = useCallback(
    (date: Date | null) => {
      if (startLunchTime && date && isBefore(date, startLunchTime)) {
        setEndLunchTime(null);
        setTimeLunch(null);
        return;
      }

      if (startLunchTime && date) {
        const lunchDate = new Date();
        lunchDate.setHours(date.getHours() - startLunchTime.getHours());
        lunchDate.setMinutes(date.getMinutes() - startLunchTime.getMinutes());
        lunchDate.setSeconds(0);

        setTimeLunch(lunchDate);

        if (endDateTime) {
          const endDate = endDateTime;
          endDate.setHours(endDateTime.getHours() + lunchDate.getHours());
          endDate.setMinutes(endDateTime.getMinutes() + lunchDate.getMinutes());

          setEndDateTime(endDate);

          const atual = new Date();
          atual.setHours(endDate.getHours() - new Date().getHours());
          atual.setMinutes(endDate.getMinutes() - new Date().getMinutes());
          atual.setSeconds(0);

          setTimeLeft(atual);
        }
      }

      setEndLunchTime(date);
    },
    [startLunchTime, endDateTime],
  );

  useEffect(() => {
    const countDonw = setInterval(() => {
      setTimeLeft((state) => state && subSeconds(state, 1));
      setFinished(false);

      if (endDateTime && startDateTime && timeLeft) {
        // const progress =
        //   (endDateTime.getTime() -
        //     startDateTime.getTime() -
        //     (endDateTime.getTime() - timeLeft.getTime())) /
        //   ((endDateTime.getTime() - startDateTime.getTime()) * 100);
        const atual = new Date();
        const endDate = endDateTime;

        const progressCalc =
          (((endDate.getHours() - startDateTime.getHours()) * 3600 +
            (endDate.getMinutes() - startDateTime.getMinutes()) * 60 +
            (endDate.getSeconds() - startDateTime.getSeconds()) -
            ((endDate.getHours() - atual.getHours()) * 3600 +
              (endDate.getMinutes() - atual.getMinutes()) * 60 +
              (endDate.getSeconds() - atual.getSeconds()))) /
            ((endDate.getHours() - startDateTime.getHours()) * 3600 +
              (endDate.getMinutes() - startDateTime.getMinutes()) * 60 +
              (endDate.getSeconds() - startDateTime.getSeconds()))) *
          100;

        let progress;

        if (progressCalc < 0) {
          progress = 0;
        } else if (progressCalc > 100) {
          progress = 100;
        } else {
          progress = Number(progressCalc.toFixed(2));
        }

        setProgessPercent(progress);
      }

      if (endDateTime && isBefore(endDateTime, new Date())) {
        setTimeLeft(null);
        setFinished(true);
        clearInterval(countDonw);
      }
    }, 1000);

    return () => clearInterval(countDonw);
  }, [endDateTime, timeLeft, startDateTime]);

  return (
    <Container>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <JobTime>
          <KeyboardTimePicker
            id="startDateTime"
            margin="normal"
            variant="dialog"
            label="Horário de Entrada"
            style={{ width: 200, margin: 20 }}
            value={startDateTime}
            format="HH:mm"
            emptyLabel=""
            onChange={handleChangeStartDateTime}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            keyboardIcon={<FiClock size={18} color="#000" />}
          />
          <KeyboardTimePicker
            id="endDateTime"
            margin="normal"
            readOnly
            disabled
            label="Horário de Saída"
            style={{ width: 200, margin: 20 }}
            value={endDateTime}
            format="HH:mm"
            emptyLabel=""
            onChange={() => {}}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            keyboardIcon={<FiClock size={18} color="#000" />}
          />
          <KeyboardTimePicker
            id="timeLeft"
            margin="normal"
            readOnly
            disabled
            label="Faltando"
            style={{ width: 200, margin: 20 }}
            value={timeLeft}
            format="HH:mm:ss"
            emptyLabel={finished ? 'Fim do horário!' : ''}
            onChange={() => {}}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            keyboardIcon={<FiClock size={18} color="#000" />}
          />
        </JobTime>
        <LunchTime>
          <KeyboardTimePicker
            id="startLunchTime"
            margin="normal"
            variant="dialog"
            label="Saída para almoço"
            style={{ width: 200, margin: 20 }}
            value={startLunchTime}
            format="HH:mm"
            emptyLabel=""
            onChange={handleChangeStartLunchTime}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            keyboardIcon={<FiClock size={18} color="#000" />}
          />
          <KeyboardTimePicker
            id="endLunchTime"
            margin="normal"
            variant="dialog"
            label="Entrada do almoço"
            style={{ width: 200, margin: 20 }}
            value={endLunchTime}
            format="HH:mm"
            emptyLabel=""
            onChange={handleChangeEndLunchTime}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            keyboardIcon={<FiClock size={18} color="#000" />}
          />
          <KeyboardTimePicker
            id="totalLunchTime"
            margin="normal"
            readOnly
            disabled
            label="Tempo de almoço"
            style={{ width: 200, margin: 20 }}
            value={timeLunch}
            format="HH:mm"
            emptyLabel=""
            onChange={() => {}}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
            keyboardIcon={<FiClock size={18} color="#000" />}
          />
        </LunchTime>
        <ProgressBar>
          <Progress
            percent={progessPercent}
            indicating
            progress
            size="large"
            style={{ width: 700 }}
          />
        </ProgressBar>
      </MuiPickersUtilsProvider>
    </Container>
  );
};

export default DailyProgress;
