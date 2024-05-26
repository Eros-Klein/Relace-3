<template>
   <div id="calender-container">
    <div id="calender-container-header">
      <!-- Calender month name -->
      <div class="calendar-date-indicator">{{ selectedMonth }}</div>

      <!-- Calender date selector -->
      <div class="calendar-date-selector">
        <span @click="selectPrevious">﹤</span>
        <span @click="selectCurrent">Today</span>
        <span @click="selectNext">﹥</span>
      </div>
    </div>

    <!-- Calender grid header -->
    <ol class="day-of-week">
    <li
      v-for="weekday in weekdays"
      :key="weekday"
    >
      {{ weekday }}
    </li>
  </ol>


    <!-- Calender grid -->
    <ol class="day-grid">
      <li
    class="calendar-day"
    :class="{
      'calendar-day--not-current': !isCurrentMonth,
      'calendar-day--today': isToday
    }"
  >
    <span>{{ label }}</span>
  </li>
    </ol>

   </div>

</template>
  
  <script>

import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  export default {
    data() {
      return {
      selectedDate: dayjs(),
      today: dayjs().format("YYYY-MM-DD")
    };
    },

  props: {
    currentDate: {
      type: String,
      required: true
    },
    _selectedDate: {
      type: Object,
      required: true
    },
    day: {
      type: Object,
      required: true
    },

    isCurrentMonth: {
      type: Boolean,
      default: false
    },

    isToday: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    selectPrevious() {
      let newSelectedDate = dayjs(this.selectedDate).subtract(1, "month");
      this.$emit("dateSelected", newSelectedDate);
    },

    selectCurrent() {
      let newSelectedDate = dayjs(this.currentDate);
      this.$emit("dateSelected", newSelectedDate);
    },

    selectNext() {
      let newSelectedDate = dayjs(this.selectedDate).add(1, "month");
      this.$emit("dateSelected", newSelectedDate);
    },

    selectDate(newSelectedDate) {
      this.selectedDate = newSelectedDate;
    }
  },

  computed: {
    selectedMonth() {
      return this.selectedDate.format("MMMM YYYY");
    },
    weekdays() {
      return weekdays;
    },
    label() {
      return this.day ? this.day.date : '';
    },
    numberOfDaysInMonth() {
      return dayjs(this.selectedDate).daysInMonth();
  },
  currentMonthDays() {
    return [...Array(this.numberOfDaysInMonth)].map((day, index) => {
      return {
        date: dayjs(`${this.year}-${this.month}-${index + 1}`).format("YYYY-MM-DD"),
        isCurrentMonth: true
      };
    });
  },
  getWeekday(date) {
    return dayjs(date).weekday();
  },
  previousMonthDays() {
    const firstDayOfTheMonthWeekday = this.getWeekday(this.currentMonthDays[0].date);
    const previousMonth = dayjs(`${this.year}-${this.month}-01`).subtract(1, "month");

    // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;

    const previousMonthLastMondayDayOfMonth = dayjs(this.currentMonthDays[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, "day").date();

    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
      return {
        date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`).format("YYYY-MM-DD"),
        isCurrentMonth: false
      }
    });
  },
  nextMonthDays() {
    const lastDayOfTheMonthWeekday = this.getWeekday(`${this.year}-${this.month}-${this.currentMonthDays.length}`);
    const nextMonth = dayjs(`${this.year}-${this.month}-01`).add(1, "month");
    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ? 7 - lastDayOfTheMonthWeekday : lastDayOfTheMonthWeekday;

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
      return {
        date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format("YYYY-MM-DD"),
        isCurrentMonth: false
      };
    });
  },
  days() {
    return [
      ...this.previousMonthDays,
      ...this.currentMonthDays,
      ...this.nextMonthDays
    ];
  },
  }
}
  </script>