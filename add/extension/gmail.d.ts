declare module 'imap/add/extension/gmail' {
    import { MessageSource, ErrorCallback, _SearchTerm, SearchTerm, SearchTermStringParam,
        SearchCallback, IImapMessageAttributes } from 'imap/types';

    type GmailSearchTerm = [
        /**
         * Gmail's custom search syntax. Example: 'has:attachment in:unread'
         */
        'X-GM-RAW' |

        /**
         * Conversation/thread id
         */
        'X-GM-THRID' |

        /**
         * Account-wide unique id
         */
        'X-GM-MSGID' |

        /**
         * Gmail label
         */
        'X-GM-LABELS',

        string
    ];

    type _GSearchTerm = _SearchTerm | GmailSearchTerm;

    type GSearchTerm =  _GSearchTerm | ['OR', _GSearchTerm, _GSearchTerm];

    interface IImapMessageAttributes {
        'x-gm-thrid': string;
        'x-gm-msgid': string;
        'x-gm-labels': string[];
    }

    interface IConnectionCommon {
        search(criteria: GSearchTerm[], callback: SearchCallback): void;
        /**
         * Replaces labels of message(s) with labels.
         */
        setLabels(source: MessageSource, labels: string | string[], callback: ErrorCallback): void;

        /**
         * Adds labels to message(s).
         */
        addLabels(source: MessageSource, labels: string | string[], callback: ErrorCallback): void;

        /**
         * Removes labels from message(s).
         */
        delLabels(source: MessageSource, labels: string | string[], callback: ErrorCallback): void;
    }
}
