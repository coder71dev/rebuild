import React from 'react';
import { PageBuilder } from '../components/page-builder/PageBuilder';

export default function PageBuilderPage() {
    return (
        <PageBuilder
            publishUrl="/pages/publish"
            aiSuggestUrl="/ai/suggest"
        />
    );
}
