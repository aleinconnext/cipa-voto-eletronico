import { UrnaButton } from "./UrnaButton";

interface UrnaKeypadProps {
  onNumberClick: (number: string) => void;
  onCorrect: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

export const UrnaKeypad = ({ 
  onNumberClick, 
  onCorrect, 
  onConfirm, 
  confirmDisabled = false 
}: UrnaKeypadProps) => {
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '']
  ];

  return (
    <div className="space-y-4">
      {/* Teclado numérico */}
      <div className="grid grid-cols-3 gap-3 justify-items-center">
        {numbers.map((row, rowIndex) => 
          row.map((num, colIndex) => (
            num ? (
              <UrnaButton
                key={`${rowIndex}-${colIndex}`}
                variant="number"
                onClick={() => onNumberClick(num)}
              >
                {num}
              </UrnaButton>
            ) : (
              <div key={`${rowIndex}-${colIndex}`} className="w-16 h-16" />
            )
          ))
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex justify-center space-x-4 pt-4">
        <UrnaButton variant="white" onClick={onCorrect}>
          CORRIGE
        </UrnaButton>
        <UrnaButton 
          variant="confirm" 
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          CONFIRMA
        </UrnaButton>
      </div>
    </div>
  );
};