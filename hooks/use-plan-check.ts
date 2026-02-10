import { useState } from 'react';

type PlanType = 'FREE' | 'PAID';

// Recursos bloqueados por plano
const planLimits = {
  FREE: {
    maxMembers: 50,
    maxUsers: 1,
    canExportReports: false,
    hasIntegrations: false,
  },
  PAID: {
    maxMembers: Infinity,
    maxUsers: Infinity,
    canExportReports: true,
    hasIntegrations: true,
  },
};

export type BlockedFeature = 
  | 'maxMembers' 
  | 'maxUsers' 
  | 'canExportReports' 
  | 'hasIntegrations';

export function usePlanCheck() {
  const [showModal, setShowModal] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<BlockedFeature | null>(null);
  
  // Em produção, isso viria de um contexto ou store
  const plan: PlanType = 'FREE';

  const checkLimit = (feature: BlockedFeature): boolean => {
    const limit = planLimits[plan][feature];
    
    // Se for um boolean, retorna direto
    if (typeof limit === 'boolean') {
      if (!limit) {
        setBlockedFeature(feature);
        setShowModal(true);
        return false;
      }
      return true;
    }
    
    // Se for um número, você pode verificar contra um contador
    return true;
  };

  const checkMemberLimit = (currentCount: number): boolean => {
    const limit = planLimits[plan].maxMembers;
    if (currentCount >= limit) {
      setBlockedFeature('maxMembers');
      setShowModal(true);
      return false;
    }
    return true;
  };

  const checkUserLimit = (currentCount: number): boolean => {
    const limit = planLimits[plan].maxUsers;
    if (currentCount >= limit) {
      setBlockedFeature('maxUsers');
      setShowModal(true);
      return false;
    }
    return true;
  };

  return {
    plan,
    checkLimit,
    checkMemberLimit,
    checkUserLimit,
    showModal,
    setShowModal,
    blockedFeature,
  };
}

