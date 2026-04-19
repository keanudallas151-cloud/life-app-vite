import {
  FeatureFrame,
  PrimaryButton,
  RoleChoiceCard,
  SecondaryButton,
  SurfaceCard,
} from "../InventorsInvestorsUI";
import { ROLE_OPTIONS } from "../../../utils/inventorsInvestors";

export function InventorsInvestorsRoleSelectionPage({
  t,
  selectedRole,
  onSelectRole,
  onContinue,
  onBack,
}) {
  return (
    <FeatureFrame
      t={t}
      eyebrow="Step 1"
      title="Choose your role"
      subtitle="Pick one clear role to start. You can keep this simple now and expand the matching logic later."
      actions={<SecondaryButton t={t} onClick={onBack}>Back</SecondaryButton>}
    >
      <SurfaceCard t={t}>
        <div style={{ display: "grid", gap: 12 }}>
          {ROLE_OPTIONS.map((role) => (
            <RoleChoiceCard
              key={role.value}
              t={t}
              role={role}
              selected={selectedRole === role.value}
              onSelect={onSelectRole}
            />
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <PrimaryButton t={t} disabled={!selectedRole} onClick={onContinue} style={{ width: "100%" }}>
            Continue
          </PrimaryButton>
        </div>
      </SurfaceCard>
    </FeatureFrame>
  );
}
