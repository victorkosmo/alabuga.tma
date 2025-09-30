<template>
  <div class="p-4 md:p-6">
    <div v-if="!user && loading" class="space-y-6">
      <!-- Form Skeleton -->
      <Card>
        <CardHeader>
          <Skeleton class="h-7 w-48" />
          <Skeleton class="h-4 w-64" />
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-10 w-full" />
          </div>
          <div class="space-y-2">
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton class="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>

    <div v-else-if="error" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки данных: {{ error.message }}</p>
    </div>

    <div v-else-if="user" class="space-y-6">
      <!-- Edit Profile Form -->
      <form @submit.prevent="handleSave">
        <Card>
          <CardHeader>
            <CardTitle>Редактировать профиль</CardTitle>
            <CardDescription>Здесь вы можете обновить имя и фамилию.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="first_name">Имя</Label>
              <Input id="first_name" v-model="formData.first_name" required />
            </div>
            <div class="space-y-2">
              <Label for="last_name">Фамилия</Label>
              <Input id="last_name" v-model="formData.last_name" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" :disabled="!isDirty || isSaving">
              <span v-if="isSaving">Сохранение...</span>
              <span v-else>Сохранить</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { successMessage, errorMessage } from '@/utils/toast';

const userStore = useUserStore();
const { user, loading, error } = storeToRefs(userStore);

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
