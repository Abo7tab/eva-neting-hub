"use client";

import { useMemo } from 'react';
import { PackageSearch, FolderTree } from 'lucide-react';
import type { Category, CategoryTreeNode } from '../types/category.types';
import { CategoryTreeNodeItem } from './category-tree-node';
import { Button } from '@/shared/components/ui/button';

interface CategoryTreeProps {
  categories: Category[];
  searchQuery: string;
  onEdit: (uuid: string) => void;
  onDelete: (category: Category) => void;
  onAddChild: (parentUuid: string) => void;
}

export function CategoryTree({
  categories,
  searchQuery,
  onEdit,
  onDelete,
  onAddChild,
}: CategoryTreeProps) {
  // Helper to construct the tree hierarchy
  const treeNodes = useMemo(() => {
    let rawList = categories;

    // If searching, we don't necessarily want to break the tree, 
    // but we want to filter the visible nodes or auto-expand parents.
    // For simplicity, we just pass the searchQuery down to nodes so they auto-expand,
    // while we filter the top-level list if we want to restrict visibility.
    // Let's implement a safe filtering that keeps parents of matched children.
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      
      const isMatch = (cat: Category) => cat.name.toLowerCase().includes(lowerQuery);
      
      const getAncestors = (cat: Category, allCats: Category[], ancestors = new Set<string>()) => {
        if (!cat.parent_uuid) return ancestors;
        const parent = allCats.find(c => c.uuid === cat.parent_uuid);
        if (parent) {
          ancestors.add(parent.uuid);
          getAncestors(parent, allCats, ancestors);
        }
        return ancestors;
      };

      const matchedIds = new Set<string>();
      categories.forEach(cat => {
        if (isMatch(cat)) {
          matchedIds.add(cat.uuid);
          getAncestors(cat, categories, matchedIds);
        }
      });
      
      rawList = categories.filter(cat => matchedIds.has(cat.uuid));
    }

    const buildTree = (parentId: string | null, level: number): CategoryTreeNode[] => {
      return rawList
        .filter(cat => cat.parent_uuid === parentId)
        .map(cat => ({
          ...cat,
          level,
          children: buildTree(cat.uuid, level + 1),
        }))
        .sort((a, b) => a.sort_order - b.sort_order);
    };

    return buildTree(null, 1);
  }, [categories, searchQuery]);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white mt-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <FolderTree className="h-10 w-10 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد أقسام بعد</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          قم بإنشاء شجرة الأقسام الخاصة بك لتنظيم المنتجات بشكل هرمي يسهل على العملاء تصفحه.
        </p>
        <Button onClick={() => onAddChild('')} className="bg-rose-600 hover:bg-rose-700">
          إضافة القسم الأول
        </Button>
      </div>
    );
  }

  if (searchQuery && treeNodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-slate-200 mt-6">
        <PackageSearch className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-1">لم يتم العثور على نتائج</h3>
        <p className="text-sm text-slate-500">جرّب كلمات بحث مختلفة</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="flex flex-col">
        {treeNodes.map((node) => (
          <CategoryTreeNodeItem
            key={node.uuid}
            node={node}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddChild={onAddChild}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}
