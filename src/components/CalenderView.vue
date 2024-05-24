<template>
    <div>
      <v-calendar
        :attributes="attrs"
        :selected-attribute="selectedAttribute"
        :selected="selectedDate"
        @click:date="selectDate"
      />
    </div>
  </template>
  
  <script>
  import { VCalendar } from 'v-calendar';
  
  export default {
    name: 'CalendarView',
    components: {
      VCalendar
    },
    data() {
      return {
        selectedDate: null,
        attrs: [],
        selectedAttribute: null
      };
    },
    methods: {
      selectDate(date) {
        this.selectedDate = date;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>