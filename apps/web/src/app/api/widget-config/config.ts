export type WidgetConfigProject = { id: string; is_active: boolean } | null;

export type WidgetConfig =
  | { active: false }
  | {
      active: true;
      theme: { buttonColor: string; position: 'bottom-right' | 'bottom-left' };
    };

export function buildWidgetConfig(project: WidgetConfigProject): WidgetConfig {
  if (!project || !project.is_active) {
    return { active: false };
  }
  return {
    active: true,
    theme: { buttonColor: '#5b6cff', position: 'bottom-right' },
  };
}
