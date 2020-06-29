<template lang="pug">
  div
    h3 Emails
    div.btnContainer
      LCButton(@clickHandler="copyAll" color="green") copy all
      LCButton(@clickHandler="clearHandler") clear
    ul.container
      template(v-if="items && items.length")
        li(v-for="item in items" :key="item")
          span(@click="copyToClipboard(item)") {{ item }}
          div.removeBtn(@click="removeItem(item)")
      span(v-else) No data...
    div.notify(:class="notifyClass") {{ notifyMessage }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LCButton from '@/components/LCButton.vue';

@Component({
  components: {
    LCButton,
  },
})
export default class App extends Vue {
  items: string[] = [];

  notifyMessage = '';

  notifyClass = '';

  clearHandler(): void {
    browser.storage.sync.clear()
      .then(() => {
        this.fetchItems();
      });
  }

  copyAll(): void {
    const text = this.items.reduce((acc, item) => `${acc ? (`${acc}, `) : acc}${item}`, '');
    this.copyToClipboard(text);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
      .then(() => {
        this.notify('copied', 'green');
      })
      .catch(() => {
        this.notify('NOT copied', 'red');
      });
  }

  notify(text: string, type: string): void {
    this.notifyMessage = text;
    this.notifyClass = type;
    setTimeout(() => {
      this.notifyMessage = '';
      this.notifyClass = '';
    }, 1000);
  }

  removeItem(item: string): void {
    const newData = [...this.items].filter((el) => el !== item);
    browser.storage.sync.set({ data: newData })
      .then(() => {
        this.fetchItems();
        this.notify('deleted', 'red');
      });
  }

  fetchItems(): void {
    browser.storage.sync.get('data')
      .then((result) => {
        this.items = result.data;
      });
  }

  mounted() {
    this.fetchItems();

    // watch storage change
    browser.storage.onChanged.addListener((result) => {
      if (result && result.data && result.data.newValue) {
        this.items = result.data.newValue;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import './../components/variables.scss';

.container {
  list-style: none;
  width: 300px;
  min-height: 30px;
  padding-left: 10px;
  margin-bottom: 20px;
  li {
    font-size: 14px;
    border: 1px solid transparent;
    margin: 3px 0;
    padding: 1px 15px 1px 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      border-radius: 3px;
      background-color: $purpleLight;
    }
    span:hover {
      color: $purple;
      transition: .1s;
      cursor: pointer;
    }
  }
}
.btnContainer {
  position: absolute;
  display: flex;
  align-items: center;
  top: 10px;
  right: 5px;
}
.removeBtn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  cursor: pointer;
  margin-left: 5px;
  &:before {
    content: '';
    display: block;
    width: 1px;
    height: 13px;
    border-radius: 2px;
    background-color: $black;
    transform: rotate(45deg);
    position: absolute;
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    height: 13px;
    border-radius: 2px;
    background-color: $black;
    transform: rotate(-45deg);
  }
}
.notify {
  position: absolute;
  bottom: 5px;
  right: 10px;
  opacity: 0;
  transition: .3s;
  &.red {
    color: $red;
    opacity: 1;
  }
  &.green {
    color: $green;
    opacity: 1;
  }
}
</style>
