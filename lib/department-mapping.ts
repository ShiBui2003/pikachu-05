// Department mapping for issue categorization
export const DEPARTMENT_MAPPING = {
  'public-works': {
    name: 'Public Works',
    categories: ['infrastructure', 'maintenance', 'potholes', 'streetlights', 'sidewalks', 'drainage', 'parks', 'public-facilities'],
    keywords: ['pothole', 'streetlight', 'sidewalk', 'drainage', 'park', 'infrastructure', 'maintenance', 'facility']
  },
  'transportation': {
    name: 'Transportation',
    categories: ['traffic', 'roads', 'signs', 'signals', 'parking', 'transit', 'bridges', 'highways'],
    keywords: ['traffic', 'road', 'sign', 'signal', 'parking', 'bus', 'bridge', 'highway', 'transit']
  },
  'environment': {
    name: 'Environment',
    categories: ['garbage', 'recycling', 'pollution', 'trees', 'green-spaces', 'waste-management', 'air-quality'],
    keywords: ['garbage', 'trash', 'recycling', 'pollution', 'tree', 'green', 'waste', 'air', 'environment']
  },
  'health': {
    name: 'Health & Safety',
    categories: ['safety', 'health', 'emergency', 'hazards', 'sanitation', 'public-health', 'safety-violations'],
    keywords: ['safety', 'health', 'emergency', 'hazard', 'sanitation', 'violation', 'unsafe', 'danger']
  },
  'utilities': {
    name: 'Utilities',
    categories: ['water', 'electricity', 'gas', 'sewer', 'power', 'utilities', 'service-outages'],
    keywords: ['water', 'electricity', 'gas', 'sewer', 'power', 'utility', 'outage', 'service']
  },
  'general': {
    name: 'General Administration',
    categories: ['general', 'other', 'complaints', 'suggestions', 'miscellaneous'],
    keywords: ['general', 'other', 'complaint', 'suggestion', 'misc', 'various']
  }
} as const;

export type DepartmentKey = keyof typeof DEPARTMENT_MAPPING;

// Function to determine if an issue belongs to a department
export function isIssueForDepartment(issue: any, department: DepartmentKey): boolean {
  if (!issue) return false;
  
  const departmentConfig = DEPARTMENT_MAPPING[department];
  if (!departmentConfig) return false;
  
  // Check if issue category matches department categories
  if (issue.category && departmentConfig.categories.includes(issue.category)) {
    return true;
  }
  
  // Check if issue title or description contains department keywords
  const searchText = `${issue.title || ''} ${issue.description || ''}`.toLowerCase();
  return departmentConfig.keywords.some(keyword => 
    searchText.includes(keyword.toLowerCase())
  );
}

// Function to get department name from key
export function getDepartmentName(departmentKey: string): string {
  return DEPARTMENT_MAPPING[departmentKey as DepartmentKey]?.name || 'Unknown Department';
}

// Function to get all categories for a department
export function getDepartmentCategories(departmentKey: string): string[] {
  return DEPARTMENT_MAPPING[departmentKey as DepartmentKey]?.categories || [];
}
