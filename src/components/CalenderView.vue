<template>
   <div id="calender-container">
    <div id="calender-container-header">
      <!-- Calender month name -->
      <div class="calendar-date-indicator">{{ selectedMonth }}</div>

      <!-- Calender date selector -->
      <div class="calendar-date-selector">
        <span @click="selectPrevious">﹤</span>
        <span @click="selectCurrent">heute</span>
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
      <CalenderMonthDayItem />
    </ol>

   </div>

</template>
  
  <script>

import dayjs from "dayjs";

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
    }
  }
}
  </script>
  
  <style>

  </style>