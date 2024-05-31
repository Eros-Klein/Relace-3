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
      <div class="day previous-month" v-for="day in previousMonthDays" :key="'previous-' + day">{{ day }}</div>
      <div class="day current-month" v-for="day in monthDays" :key="'current-' + day" :class="{ 'current-day': day === currentDate.date() && currentMonth.month() === currentDate.month() && currentMonth.year() === currentDate.year() }"> {{ weekdays[index] }}{{ day }}</div>
      <div class="day next-month" v-for="day in nextMonthDays" :key="'next-' + day">{{ day }}</div>
    </div>

    <!-- Assignments -->
    <div class="assignment" 
           v-for="assignment in assignmentsForDay(day)" 
           :key="assignment.id">
        {{ assignment.title }}
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
  monthDays() {
    return Array.from({ length: this.currentMonth.daysInMonth() }, (_, i) => i + 1);
  },
  previousMonthDays() {
    const currentMonthStartDay = this.currentMonth.startOf('month').day() === 0 ? 6 : this.currentMonth.startOf('month').day() - 1;
    const totalDays = currentMonthStartDay + this.currentMonth.daysInMonth();
    const previousMonthDaysToShow = totalDays <= 35 ? currentMonthStartDay : currentMonthStartDay - 7;
    return Array.from({ length: previousMonthDaysToShow }, (_, i) => this.currentMonth.subtract(1, 'month').daysInMonth() - i).reverse();
  },
  nextMonthDays() {
    const totalDays = this.previousMonthDays.length + this.monthDays.length;
    const nextMonthDaysToShow = 35 - totalDays;
    return Array.from({ length: nextMonthDaysToShow }, (_, i) => i + 1);
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
/* Calender header */
.calender-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f0f0f0;
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
  color: black; 
  background: none; 
  border: none; 
}

#today-button,
.nav-button {
  transition: background-color 0.3s ease; 
}

#today-button:hover {
  background-color: black; 
}

.nav-button:hover {
  background-color: black;
  border: none;
  border-radius: 50%;
}

/* Calendar grid */
.calendar-grid {
  margin-top: 10px;
  margin-left: 45px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 10px;
  height: calc(100vh - 200px);
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

/* Weekday header */
.day-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  color: white;
  margin-left: 45px;
  align-items: center;
  text-align: center;
  padding: 2px 0;
}

/*current Day in calender grid*/
.current-day {
  color: aqua; 
}

</style>