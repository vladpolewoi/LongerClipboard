<template lang="pug">
  div.btn(
    :class="buttonColor"
    @click="$emit('clickHandler', $event)"
  )
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class LCButton extends Vue {
  @Prop({ default: 'purple' })
  readonly color!: string;

  get buttonColor(): string {
    switch (this.color) {
      case 'green':
        return 'green';
      case 'purple':
        return 'purple';
      default:
        return 'purple';
    }
  }
}
</script>

<style lang="scss" scoped>
@import './variables.scss';

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  padding: 3px 5px;
  margin: 0 5px;
  border: 1px solid $purple;
  border-radius: 3px;
  transition: .1s;
  cursor: pointer;
  &.purple {
    color: $purple;
    border-color: $purple;
    &:hover {
      background-color: $purple;
    }
  }
  &.green {
    color: $green;
    border-color: $green;
    &:hover {
      background-color: $green;
    }
  }
  &:hover {
    color: $white;
  }
}
</style>
