import React, { useState, useMemo } from 'react'
import CodelancePortfolioCard from '../CodelancePortfolioCard/CodelancePortfolioCard'

const CodelancePortfolioGrid = ({
  projects = [],
  activeFilter = 'all',
  onProjectClick = null,
  columns = 3,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return projects
    }
    return projects.filter(project => {
      const projectCategory = (project.category || project.type || '').toLowerCase()
      return projectCategory === activeFilter || 
             projectCategory.includes(activeFilter) ||
             (project.tags && project.tags.some(tag => tag.toLowerCase().includes(activeFilter)))
    })
  }, [projects, activeFilter])

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12 text-[#5e808d] dark:text-gray-400">
        <p>No projects found in this category.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-8 lg:gap-10 ${className}`}>
      {filteredProjects.map((project, index) => (
        <CodelancePortfolioCard
          key={project.id || index}
          id={project.id}
          title={project.title || project.name || "Project"}
          imageUrl={project.imageUrl || project.image || project.thumbnail || project.thumbnail_url}
          imageAlt={project.imageAlt || project.title || "Project image"}
          tags={project.tags || project.technologies || project.tech_stack || []}
          category={project.category || project.type || null}
          projectUrl={project.projectUrl || project.project_url || null}
          onClick={onProjectClick}
          className=""
        />
      ))}
    </div>
  )
}

export default CodelancePortfolioGrid

