<template>
  <div class="p-4 md:p-6">
    <div v-if="loading" class="space-y-6">
      <!-- Skeleton Loader -->
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

    <div v-else-if="fetchError" class="text-center py-10 text-destructive">
      <p>Ошибка загрузки данных: {{ fetchError.message }}</p>
    </div>

    <form v-else-if="user" @submit.prevent="handleSave" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки профиля</CardTitle>
          <CardDescription>Здесь вы можете обновить информацию о своем профиле.</CardDescription>
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
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { getMe } from '@/features/homePanel/services/user.service';
import { updateMe } from './services/user.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { successMessage, errorMessage } from '@/utils/toast';

const user = ref(null);
const formData = reactive({
  first_name: '',
  last_name: '',
});
const loading = ref(true);
const isSaving = ref(false);
const fetchError = ref(null);

const isDirty = computed(() => {
  if (!user.value) return false;
  return formData.first_name !== user.value.first_name || formData.last_name !== (user.value.last_name || '');
});

const fetchUser = async () => {
  loading.value = true;
  fetchError.value = null;
  try {
    const userData = await getMe();
    user.value = userData;
    formData.first_name = userData.first_name;
    formData.last_name = userData.last_name || '';
  } catch (err) {
    fetchError.value = err;
    console.error('Failed to fetch user data:', err);
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  if (!isDirty.value) return;

  isSaving.value = true;
  try {
    const updatedUser = await updateMe({
      first_name: formData.first_name,
      last_name: formData.last_name,
    });
    user.value = updatedUser;
    formData.first_name = updatedUser.first_name;
    formData.last_name = updatedUser.last_name || '';
    successMessage('Профиль успешно обновлен');
  } catch (err) {
    console.error('Failed to update user profile:', err);
    errorMessage(err.message || 'Не удалось обновить профиль');
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchUser);
</script>
