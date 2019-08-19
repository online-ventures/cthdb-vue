<template lang="pug">
form(@submit.prevent="saveRecord()")
  h1(class="title") Your profile
  b-field(label="Name")
    b-input(v-model="record.name" required)
  b-button(:class="{ 'is-loading': isSaving }"
    type="is-primary"
    icon-left="save"
    @click.prevent="saveRecord()") Save
</template>

<script>
export default {
}
</script>
