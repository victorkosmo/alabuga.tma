<template>
  <div class="relative pr-3">
    <Avatar class="h-12 w-12">
      <AvatarImage
        v-if="user.avatar_url"
        :src="user.avatar_url"
        :alt="user.username"
      />
      <AvatarImage
        v-else-if="user.rank_image_url"
        :src="user.rank_image_url"
        :alt="user.rank_title"
      />
      <AvatarFallback v-else>{{ user.first_name?.charAt(0) }}{{ user.last_name?.charAt(0) }}</AvatarFallback>
    </Avatar>
    <Avatar v-if="user.avatar_url && user.rank_image_url" class="absolute bottom-0 right-0 h-7 w-7">
      <AvatarImage :src="user.rank_image_url" :alt="user.rank_title" />
    </Avatar>
  </div>
</template>

<script setup>
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>
