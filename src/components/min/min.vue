<template>
  <span>{{mins}}</span>
</template>
<script>
export default {
  name: 'min',
  props: {
    mins: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      
    }
  }
}
</script>
