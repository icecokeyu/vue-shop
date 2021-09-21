<template>
  <div>
    <img src="~assets/img/cart/tick.svg" class="check-button" :class="{checked : isChecked}" />
  </div>
</template>

<script>
export default {
  name: 'CheckBotton',
  props: {
    isChecked:{
      type: Boolean,
      default() {
        return true
      }
    }
  }

}
</script>

<style>
  .check-button {
    border-radius: 50%;
    border: 2px solid #aaa;
  }
  .checked {
    border-color: var(--color-tint);
    background-color: var(--color-tint);
  }
</style>