#!/bin/bash
# Performance Optimization Checklist
# Run this to identify components that still need optimization

echo "🔍 Scanning for unoptimized Image components..."
echo ""

# Find all Image components without lazy loading
echo "❌ Images without lazy loading:"
grep -r "<Image" components/ --include="*.jsx" | grep -v "loading=\"lazy\"" | head -20

echo ""
echo "❌ API calls without caching:"
grep -r "customFetch\|fetch(" components/ --include="*.jsx" | grep -v "getCachedData" | head -20

echo ""
echo "✅ Already optimized files:"
grep -r "loading=\"lazy\"" components/ --include="*.jsx" | cut -d: -f1 | sort -u

echo ""
echo "Total Image components to optimize:"
grep -r "<Image" components/ --include="*.jsx" | wc -l

echo ""
echo "Image components with lazy loading:"
grep -r "loading=\"lazy\"" components/ --include="*.jsx" | wc -l
