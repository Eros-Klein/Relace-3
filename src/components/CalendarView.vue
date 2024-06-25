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
        <div id="assignment-container-cal">
          <div class="assignment-calendar"
               v-for="assignment in assignmentsForDay(day.date, day.month, day.year)"
               :key="assignment.id">
            {{ assignment.title }}
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script lang="js">
import dayjs from 'dayjs';
import NavBar from "@/components/NavBar.vue";

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
    NavBar() {
      return NavBar
    },
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
    addEventListeners(){
      console.log("started");
      const elements = document.getElementsByClassName('assignment-calendar');
      console.log(elements);
      for (let element = 0; element < elements.length; element++){
        const id = this.assignments.find((assignment) => assignment.title === elements[element].innerHTML);
        console.log(id)
        console.log(elements[element]);
        elements[element].addEventListener('click', () => {
          this.$router.push('/a/' + id.id);
          window.history.pushState(null, '', '/a/' + id.id);
        });
      }
    },
    async loadAssignments() {
      const startOfMonth = this.currentMonth.startOf('month').subtract(1, 'month').unix();
      const endOfMonth = this.currentMonth.endOf('month').add(1, 'month').unix();

      const response = await fetch('https://relacexyz.duckdns.org/api/a/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jwt: localStorage.getItem("token"),
          count: 0,
          offset: 0,
          compact: false,
          searchParams: '',
          course: '',
          after: startOfMonth,
          before: endOfMonth,
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
  mounted: function() {
    setTimeout(this.addEventListeners, 3000);
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
  margin-left: 100px;
}

.calender-text {
  font-size: 20px;
  font-weight: 500;
}

#today-button {
  font-size: large;
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: black;
  background: white;
  border-color: none;
  appearance: none;
}

.nav-button {
  border-radius: 50%;
  font-size: large;
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

  color: black;
}

.nav-button:hover {
  background-color: pink;
  color: black;
  border: none;
}

/* calendar grid */
.calendar-grid {
  margin-top: 10px;
  margin-left: 200px;
  margin-right: 100px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(7, 12vw);
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
  grid-template-columns: repeat(7, 12vw);
  gap: 10px;
  color: white;
  margin-left: 200px;
  margin-right: 100px;
  align-items: center;
  text-align: center;
  padding: 2px 0;
}

/*current day in calender grid*/
.current-day {
  color: pink;
  border-color: pink;
}

.assignment-calendar{
  background-color: rgba(255, 192, 203, 0.38);
  color: white;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  width: 100%;
  height: 100%;
  transition: all 0.25s ease-in-out;
}

#assignment-container-cal {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-evenly;
  justify-content: space-evenly;
  gap: 10px;
  padding-right: 10px;
}

.assignment-calendar:hover {
  background-color: rgba(250, 224, 228, 0.58);
}
</style>