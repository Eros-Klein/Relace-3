<template>
<div class="calender">

      <div class="calender-header">
        <p id="calender-text">Calender</p>
        <button id="today-button" @click="goToCurrentMonth">Today</button>
        <button class="nav-button" @click="previousMonth">{{ '<' }}</button>
        <button class="nav-button" @click="nextMonth">{{ '>' }}</button>
        <p>{{ MonthAndYear }}</p>
      </div>
    <div class="day-header">
      <div class="weekday" v-for="weekday in weekdays" :key="weekday">
        {{ weekday }}
      </div>
    </div>
    <div class="calendar-grid">
      <!-- Tage des Monats -->
      <div class="day" 
         v-for="day in allDays" 
         :key="day.key" 
         :class="{ 'current-day': day.isCurrentDay, 'current-month': day.isCurrentMonth, 'other-month': !day.isCurrentMonth }">
      {{ day.date }}

      <!-- Assignments -->
      <div class="assignment" 
           v-for="assignment in assignmentsForDay(day.date, day.month, day.year)" 
           :key="assignment.id">
        {{ assignment.title }}
      </div>
    </div>
  </div>
</div>

  
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: "CalenderView",

  data() {
    return {
      currentMonth: dayjs(),
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      assignments: [],
    };
  },
  computed: {
  MonthAndYear() {
    return this.currentMonth.format('MMMM YYYY');
  },
  currentDate() {
    return dayjs();
  },
  assignmentsForDay() {
      return (day) => {
        return this.assignments.filter(assignment => {
          const deadlineDate = new Date(assignment.deadline);
          return day === deadlineDate.getDate() && this.currentMonth.month() === deadlineDate.getMonth() && this.currentMonth.year() === deadlineDate.getFullYear();
        });
      }
    },
    allDays() {
      const previousMonth = this.currentMonth.clone().subtract(1, 'months');
      const nextMonth = this.currentMonth.clone().add(1, 'months');

      let startDay = this.currentMonth.startOf('month').day() - 1;
      if (startDay === -1) startDay = 6;

      let endDay = this.currentMonth.endOf('month').day() - 1;
      if (endDay === -1) endDay = 6;

      const previousMonthDays = Array.from({ length: startDay }, (_, i) => ({
        date: previousMonth.daysInMonth() - startDay + i + 1,
        month: previousMonth.month(),
        year: previousMonth.year(),
        isCurrentDay: false,
        isCurrentMonth: false,
        key: `previous-${i + 1}`,
      }));

      const monthDays = Array.from({ length: this.currentMonth.daysInMonth() }, (_, i) => ({
        date: i + 1,
        month: this.currentMonth.month(),
        year: this.currentMonth.year(),
        isCurrentDay: i + 1 === this.currentDate.date() && this.currentMonth.month() === this.currentDate.month() && this.currentMonth.year() === this.currentDate.year(),
        isCurrentMonth: true,
        key: `current-${i + 1}`,
      }));

      const nextMonthDays = Array.from({ length: 6 - endDay }, (_, i) => ({
        date: i + 1,
        month: nextMonth.month(),
        year: nextMonth.year(),
        isCurrentDay: false,
        isCurrentMonth: false,
        key: `next-${i + 1}`,
      }));

      const allDays = [...previousMonthDays, ...monthDays, ...nextMonthDays];

      return allDays.slice(0, 35);
    },
},
created() {
  this.loadAssignments();
},
methods: {
    nextMonth() {
      this.currentMonth = this.currentMonth.add(1, 'month');
    },
    previousMonth() {
      this.currentMonth = this.currentMonth.subtract(1, 'month');
    },
    goToCurrentMonth() {
      this.currentMonth = dayjs();
    },
    async loadAssignments() {
    const response = await fetch('/a/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwt: localStorage.getItem("token"),
        count: 'all',
        offset: 0,
        compact: false,
        searchParams: '',
        course: '',
        after: 0,
        before: 'unlimited',
        order: 'desc',
      }),
    });

    const data = await response.json();

    if (data.success) {
      this.assignments = data.assignments.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        deadline: new Date(assignment.deadline * 1000).toISOString().split('T')[0],
      }));
    } else {
      console.error('Failed to load assignments:', data.message);
    }
  },
},
};
</script>

<style scoped>
/* calender header */
.calender-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  margin-left: 44px;
}

.calender-text {
  font-size: 20px;
  font-weight: 500;
}

#today-button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: black;
  background: #ccc;
  appearance: none;
}

.nav-button {
  color: white; 
  background: none; 
  border: none; 
}

#today-button,
.nav-button {
  transition: background-color 0.3s ease; 
}

#today-button:hover {
  background-color: pink; 
}

.nav-button:hover {
  background-color: pink;
  border: none;
  border-radius: 50%;
}

/* calendar grid */
.calendar-grid {
  margin-top: 10px;
  margin-left: 46px;
  margin-right: 12px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(90px, auto);
  gap: 10px;
  height: calc(100vh - 50vh);
}

.day-label {
  font-weight: bold;
}

.day {
  padding: 10px;
  border: 1px solid #e0e0e0;
  color: white;
  border-radius: 5px;
  display: flex;
  justify-content: left;
  align-items: top;
  cursor: pointer;
}

/* weekday header */
.day-header {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  color: white;
  margin-left: 45px;
  align-items: center;
  text-align: center;
  padding: 2px 0;
}

/*current day in calender grid*/
.current-day {
  color: aqua; 
}

</style>