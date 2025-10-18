<template>
  <header class="p-4 bg-background border-b border-border">
    <div v-if="loading">
      <!-- User Profile Card Skeleton -->
      <div class="flex flex-row items-center justify-between gap-4">
        <div class="flex flex-row items-center gap-4">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-24" />
          </div>
        </div>
        <div class="flex items-center justify-end gap-1">
          <Skeleton class="h-6 w-12" />
          <Skeleton class="h-6 w-6" />
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center text-destructive">
      <p>Не удалось загрузить профиль</p>
    </div>

    <div v-else-if="user" class="flex flex-row items-center justify-between gap-4 p-1">
      <Dialog v-model:open="isEditDialogOpen">
        <DialogTrigger as-child>
          <div class="flex flex-row items-center gap-2 overflow-hidden cursor-pointer">
            <UserAvatar :user="user" />
            <div class="overflow-hidden">
              <div class="flex items-center gap-2">
                <h1 class="font-semibold text-lg truncate">{{ user.first_name }} {{ user.last_name }}</h1>
                <Pencil class="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <p class="text-sm text-muted-foreground truncate">{{ user.rank_title || `@${user.username}` }}</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
            <DialogDescription>Здесь вы можете обновить имя и фамилию.</DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label for="first_name">Имя</Label>
              <Input id="first_name" v-model="formData.first_name" required />
            </div>
            <div class="space-y-2">
              <Label for="last_name">Фамилия</Label>
              <Input id="last_name" v-model="formData.last_name" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" @click="handleSave" :disabled="!isDirty || isSaving">
              <span v-if="isSaving">Сохранение...</span>
              <span v-else>Сохранить</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div class="text-right">
        <div class="flex items-center justify-end gap-1 font-semibold text-lg">
          <span class="text-[22px]">{{ user.mana_points }}</span>
          <img src="/mana.svg" alt="Mana" class="h-10 w-10" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import UserAvatar from './UserAvatar.vue';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-vue-next';
import { successMessage, errorMessage } from '@/utils/toast';

const userStore = useUserStore();
const { user, loading, error } = storeToRefs(userStore);

const isEditDialogOpen = ref(false);

const formData = reactive({
  first_name: '',
  last_name: '',
});
const isSaving = ref(false);

const isDirty = computed(() => {
  if (!user.value) return false;
  return formData.first_name !== user.value.first_name || formData.last_name !== (user.value.last_name || '');
});

// When the user data loads in the store, populate the form
watch(user, (currentUser) => {
  if (currentUser) {
    formData.first_name = currentUser.first_name || '';
    formData.last_name = currentUser.last_name || '';
  }
}, { immediate: true });

const handleSave = async () => {
  if (!isDirty.value) return;

  isSaving.value = true;
  try {
    await userStore.updateUser({
      first_name: formData.first_name,
      last_name: formData.last_name,
    });
    successMessage('Профиль успешно обновлен');
    isEditDialogOpen.value = false;
  } catch (err) {
    errorMessage(err.message || 'Не удалось обновить профиль');
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  userStore.fetchUser();
});
</script>
