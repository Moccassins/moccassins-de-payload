'use client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $insertNodeToNearestRoot, $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { useModal } from '@payloadcms/ui'
import {
  $createParagraphNode,
  $getNodeByKey,
  $getPreviousSelection,
  $getSelection,
  $insertNodes,
  $isParagraphNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  type RangeSelection,
} from 'lexical'
import React, { useEffect, useState } from 'react'

import type { PluginComponent } from '../../typesClient.js'
import type { BlocksFeatureClientProps } from '../feature.client.js'
import type { BlockFields } from '../nodes/BlocksNode.js'
import type { InlineBlockNode } from '../nodes/InlineBlocksNode.js'

import { FieldsDrawer } from '../../../utilities/fieldsDrawer/Drawer.js'
import { $createBlockNode, BlockNode } from '../nodes/BlocksNode.js'
import { $createInlineBlockNode } from '../nodes/InlineBlocksNode.js'
import {
  INSERT_BLOCK_COMMAND,
  INSERT_INLINE_BLOCK_COMMAND,
  OPEN_INLINE_BLOCK_DRAWER_COMMAND,
} from './commands.js'

export type InsertBlockPayload = Exclude<BlockFields, 'id'>

const drawerSlug = 'lexical-inlineBlocks-create'

export const BlocksPlugin: PluginComponent<BlocksFeatureClientProps> = () => {
  const [editor] = useLexicalComposerContext()
  const { closeModal, toggleModal } = useModal()
  const [blockFields, setBlockFields] = useState<BlockFields>({} as any)
  const [blockType, setBlockType] = useState<string>('' as any)
  const [targetNodeKey, setTargetNodeKey] = useState<null | string>(null)

  useEffect(() => {
    if (!editor.hasNodes([BlockNode])) {
      throw new Error('BlocksPlugin: BlocksNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand<InsertBlockPayload>(
        INSERT_BLOCK_COMMAND,
        (payload: InsertBlockPayload) => {
          editor.update(() => {
            const selection = $getSelection() || $getPreviousSelection()

            if ($isRangeSelection(selection)) {
              const blockNode = $createBlockNode(payload)
              // Insert blocks node BEFORE potentially removing focusNode, as $insertNodeToNearestRoot errors if the focusNode doesn't exist
              $insertNodeToNearestRoot(blockNode)

              const { focus } = selection
              const focusNode = focus.getNode()

              // First, delete currently selected node if it's an empty paragraph and if there are sufficient
              // paragraph nodes (more than 1) left in the parent node, so that we don't "trap" the user
              if (
                $isParagraphNode(focusNode) &&
                focusNode.getTextContentSize() === 0 &&
                focusNode
                  .getParent()
                  .getChildren()
                  .filter((node) => $isParagraphNode(node)).length > 1
              ) {
                focusNode.remove()
              }
            }
          })

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        INSERT_INLINE_BLOCK_COMMAND,
        (fields) => {
          console.log('INSERT_INLINE_BLOCK_COMMAND', fields)
          if (targetNodeKey) {
            console.log('targetNodeKey', targetNodeKey)
            const node: InlineBlockNode = $getNodeByKey(targetNodeKey)
            console.log('node', node)

            if (!node) {
              return false
            }
            node.setFields(fields as BlockFields)
            console.log('setf')

            setTargetNodeKey(null)
            return true
          }
          console.log('creating')

          const inlineBlockNode = $createInlineBlockNode(fields as BlockFields)
          console.log('inserting', inlineBlockNode)
          $insertNodes([inlineBlockNode])
          if ($isRootOrShadowRoot(inlineBlockNode.getParentOrThrow())) {
            $wrapNodeInElement(inlineBlockNode, $createParagraphNode).selectEnd()
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        OPEN_INLINE_BLOCK_DRAWER_COMMAND,
        ({ fields, nodeKey }) => {
          setBlockFields((fields as BlockFields) ?? ({} as BlockFields))
          setTargetNodeKey(nodeKey ?? null)
          setBlockType((fields as BlockFields).blockType ?? ('' as any))

          if (nodeKey) {
            toggleModal(drawerSlug)
            return true
          }

          let rangeSelection: RangeSelection | null = null

          editor.getEditorState().read(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              rangeSelection = selection
            }
          })

          if (rangeSelection) {
            //setLastSelection(rangeSelection)
            toggleModal(drawerSlug)
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  return (
    <FieldsDrawer
      data={blockFields}
      drawerSlug={drawerSlug}
      drawerTitle="Create Inline Block"
      featureKey="blocks"
      handleDrawerSubmit={(_fields, data) => {
        closeModal(drawerSlug)
        if (!data) {
          return
        }

        data.blockType = blockType

        editor.dispatchCommand(INSERT_INLINE_BLOCK_COMMAND, data)
      }}
      schemaPathSuffix={blockFields.blockType}
    />
  )
}
