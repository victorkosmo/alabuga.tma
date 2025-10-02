// src/features/campaignPage/composables/useMissionInteraction.js
import { ref, shallowRef } from 'vue';
import LockedMissionDialogContent from '../components/LockedMissionDialogContent.vue';
import QrMissionDialogContent from '../components/QrMissionDialogContent.vue';

export function useMissionInteraction() {
  const isDialogOpen = ref(false);
  const dialogTitle = ref('');
  const dialogDescription = ref('');
  const dialogContentComponent = shallowRef(null);
  const dialogContentProps = ref({});

  function openMissionDialog(mission, campaign) {
    dialogContentComponent.value = null;
    dialogContentProps.value = {};
    
    if (mission.submission_status === 'PENDING_REVIEW') {
      dialogTitle.value = 'Миссия на рассмотрении';
      dialogDescription.value = 'Модератор скоро проверит ваше выполнение, и вы получите уведомление.';
    } else if (mission.type === 'QR_CODE' && !mission.is_completed && !mission.is_locked) {
      dialogTitle.value = 'Отсканируйте QR код';
      dialogDescription.value = mission.description;
      dialogContentComponent.value = QrMissionDialogContent;
      dialogContentProps.value = {};
    } else if (mission.is_locked) {
      const achievement = campaign.achievements?.find(a => a.name === mission.required_achievement_name);
      dialogTitle.value = 'Для открытия миссии необходимо достижение';
      dialogDescription.value = '';
      if (achievement) {
        dialogContentComponent.value = LockedMissionDialogContent;
        dialogContentProps.value = { achievement };
      } else {
        dialogDescription.value = `Требуется достижение: "${mission.required_achievement_name}", но его детали не найдены.`;
      }
    } else {
      return;
    }

    isDialogOpen.value = true;
  }

  return {
    isDialogOpen,
    dialogTitle,
    dialogDescription,
    dialogContentComponent,
    dialogContentProps,
    openMissionDialog,
  };
}
