import { ReactNode, useCallback, RefObject } from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

interface BottomSheetProps {
  sheetRef: RefObject<BottomSheetModal>;
  snapPoints?: string[];
  children: ReactNode;
  onDismiss?: () => void;
  enablePanDownToClose?: boolean;
}

export function BottomSheet({
  sheetRef,
  snapPoints = ['50%', '90%'],
  children,
  onDismiss,
  enablePanDownToClose = true,
}: BottomSheetProps) {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#212121' }}
      handleIndicatorStyle={{ backgroundColor: '#797979', width: 36, height: 4 }}
      animationConfigs={{
        damping: 30,
        stiffness: 200,
        mass: 1,
        overshootClamping: true,
      } as any}
    >
      <BottomSheetView className="flex-1 px-4">{children}</BottomSheetView>
    </BottomSheetModal>
  );
}
