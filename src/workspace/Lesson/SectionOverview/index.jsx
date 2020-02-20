import React, { useEffect, useState, useContext } from "react"
import styled, { css } from "styled-components"
import Heading from "~/components/Heading"

import theme from "~/theme"

import Preview from "./Preview"
import Settings from "./Settings"
import SidebarControls from "./SidebarControls"
import { showSectionOverview } from "~/Contexts/view.actions"

import {useDrop} from 'react-dnd'
import { findPreviousNode } from "@edtr-io/store"

const Wrapper = styled.div`
    left: 0;
    position: fixed;
    bottom: 0;
    min-width: 50px;
    height: calc(100vh - 62px);
    overflow: hidden;
    transition: 250ms all ease-in-out;
    background-color: rgba(69, 91, 106, 0.25);
    z-index: 2;
    box-shadow: inset -3px 0px 6px rgba(0, 0, 0, 0.1),
        inset -3px 0px 6px rgba(0, 0, 0, 0.18);
    border-radius: 0;

    ${props =>
		!props.expanded &&
        css`
            box-shadow: none;
            background-color: #fff;
        `}
`

const Previews = styled.div`

    width: 100%;
    height: calc(100vh - 62px);
    overflow: auto;
    padding-bottom: 100px;
    ${props =>
		!props.expanded &&
        css`
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-bottom: 150px;
        `}
`

function useResizeListener(store, dispatch) {
	function resizeListener() {
		if (store.view.sectionOverviewExpanded && window.innerWidth < 1350) {
			dispatch(showSectionOverview(false))
		}

		if (
			store.view.sectionOverviewExpanded === false &&
            window.innerWidth > 1350
		) {
			dispatch(showSectionOverview(true))
		}
	}

	useEffect(() => {
		if (window.innerWidth > 1350 && !store.view.bootstrapFinished) {
			dispatch(showSectionOverview(true))
		}

		// window.addEventListener("resize", resizeListener)
		// return () => window.removeEventListener("resize", resizeListener)
	}, [store.view.sectionOverviewExpanded])
}



const SectionOverview = ({ store, dispatch }) => {
	useResizeListener(store, dispatch)
	const {
		sections,
		view: {
			sectionOverviewExpanded: expanded,
			editing,
		}
	} = store;

	function moveSection(fromIndex, toIndex) {
		console.log(fromIndex, toIndex);
		dispatch({ type: "SWAP_SECTIONS", payload: [fromIndex, toIndex] })
	}

	const getSectionIndex = id => {
		return sections.findIndex(s => s._id === id)

	}

	const [, drop] = useDrop({ accept: 'Preview' })
	return (
		<React.Fragment>
			<Wrapper expanded={expanded} editing={editing}>
				<Previews ref={drop} editing={editing} expanded={expanded}>
					{sections
						.filter((section, index) => {
							if (editing) return true
							return section.visible
						})
						.map((section, index) => {
							const editorKey =
                                section._id +
                                "-" +
                                Math.round(new Date().getTime() / 5000)
							return (
								<Preview
									k={editorKey}
									store={store}
									moveSection={moveSection}
									dispatch={dispatch}
									section={section}
									index={index}
									expanded={expanded}
									active={store.view.activeSectionId === section._id}
									key={section._id}
									getSectionIndex={getSectionIndex}
								/>
							)
						})}
				</Previews>
				<SidebarControls store={store} dispatch={dispatch} />
			</Wrapper>
			<Settings />
		</React.Fragment>
	)
}

export default SectionOverview
