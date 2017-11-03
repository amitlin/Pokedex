module.exports = `
<ul class="type-list">
  <li v-for="type in types" :style="{background: colors[type]}">{{ type }}</li>
</ul>
`
