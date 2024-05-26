<template>
    <div class="calendar-date-indicator">{{ selectedMonth }}</div>
  </template>
  
  <script>
  export default {
    props: {
      selectedDate: {
        type: Object,
        required: true
      }
    },
  
    computed: {
      selectedMonth() {
        return this.selectedDate.format("MMMM YYYY");
      }
    }
  };
  </script>
  
  <style scoped>
  .calendar-date-indicator {
    margin-left: 200px;
    font-size: 24px;
    font-weight: 600;
    color: black;
    list-style-type: none;
  }
  </style>
  
  