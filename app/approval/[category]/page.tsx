import ApprovalCategoryClient from "./approval-category-client"

interface ApprovalCategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function ApprovalCategoryPage({ params }: ApprovalCategoryPageProps) {
  const { category } = await params

  return <ApprovalCategoryClient category={category} />
}
