<template>
  <div>
    <h4 class="font-semibold text-sm mt-6 mb-3">Достижения:</h4>
    <div class="flex flex-wrap gap-4">
      <Dialog v-for="achievement in achievements" :key="achievement.id">
        <DialogTrigger as-child>
          <div class="relative cursor-pointer group">
            <Avatar
              :class="['h-16 w-16 border-2 transition-all', achievement.is_earned ? 'border-green-500' : 'border-transparent']"
            >
              <AvatarImage
                :src="achievement.image_url"
                :alt="achievement.name"
                :class="['transition-all', !achievement.is_earned && 'grayscale group-hover:grayscale-0']"
              />
              <AvatarFallback>{{ achievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <div class="absolute bottom-0 right-0 bg-background/80 rounded-full p-0.5">
              <Info class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent class="max-w-[90vw] rounded-lg">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-3">
              <Avatar>
                <AvatarImage :src="achievement.image_url" :alt="achievement.name" />
                <AvatarFallback>{{ achievement.name.substring(0, 2).toUpperCase() }}</AvatarFallback>
              </Avatar>
              {{ achievement.name }}
            </DialogTitle>
            <DialogDescription v-if="achievement.description">
              {{ achievement.description }}
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-4 py-4">
            <div v-if="achievement.mana_reward > 0">
              <h5 class="font-semibold text-sm mb-1">Награда</h5>
              <p class="text-sm text-muted-foreground">{{ achievement.mana_reward }} MP</p>
            </div>

            <div>
              <h5 class="font-semibold text-sm mb-2">Для получения нужно выполнить миссии:</h5>
              <ul v-if="achievement.required_missions.length > 0" class="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li v-for="mission in achievement.required_missions" :key="mission.id">
                  {{ mission.title }}
                </li>
              </ul>
              <p v-else class="text-sm text-muted-foreground">Нет обязательных миссий.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Info } from 'lucide-vue-next';

defineProps({
  achievements: {
    type: Array,
    required: true,
  },
});
</script>
