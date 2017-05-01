declare module 'imap/types' {
    /**
     * MessageSource can be a single message identifier, a message identifier range
     * (e.g. '2504:2507' or '*' or '2504:*'), an array of message identifiers, or an array of message identifier ranges.
     */
    export type MessageSource = number | string | Array<number | string>;

    export type ErrorCallback = (err: Error) => void;
    export type SearchCallback = (err: Error, uids: number[]) => void;

    type SearchTermNoParam =
        /**
         * All messages.
         */
        'ALL' |
        '!ALL' |

        /**
         * Messages with the Answered flag set.
         */
        'ANSWERED' |
        '!ANSWERED' |

        /**
         * Messages with the Deleted flag set.
         */
        'DELETED' |
        '!DELETED' |

        /**
         * Messages with the Draft flag set.
         */
        'DRAFT' |
        '!DRAFT' |

        /**
         *  Messages with the Flagged flag set.
         */
        'FLAGGED' |
        '!FLAGGED' |

        /**
         * Messages that have the Recent flag set but not the Seen flag.
         */
        'NEW' |
        '!NEW' |

        /**
         * Messages that have the Seen flag set.
         */
        'SEEN' |
        '!SEEN' |

        /**
         * Messages that have the Recent flag set.
         */
        'RECENT' |
        '!RECENT' |

        /**
         * Messages that do not have the Recent flag set. This is functionally equivalent to "!RECENT" (as opposed to
         * "!NEW").
         */
        'OLD' |
        '!OLD' |

        /**
         * Messages that do not have the Answered flag set.
         */
        'UNANSWERED' |
        '!UNANSWERED' |

        /**
         * Messages that do not have the Deleted flag set.
         */
        'UNDELETED' |
        '!UNDELETED' |

        /**
         * Messages that do not have the Draft flag set.
         */
        'UNDRAFT' |
        '!UNDRAFT' |

        /**
         * Messages that do not have the Flagged flag set.
         */
        'UNFLAGGED' |
        '!UNFLAGGED' |

        /**
         * Messages that do not have the Seen flag set.
         */
        'UNSEEN' |
        '!UNSEEN'
        ;

    type SearchTermStringParam = [
        /**
         * Messages that contain the specified string in the BCC field.
         */
        'BCC' |
        '!BCC' |

        /**
         * Messages that contain the specified string in the CC field.
         */
        'CC' |
        '!CC' |

        /**
         * Messages that contain the specified string in the FROM field.
         */
        'FROM' |
        '!FROM' |

        /**
         * Messages that contain the specified string in the SUBJECT field.
         */
        'SUBJECT' |
        '!SUBJECT' |

        /**
         * Messages that contain the specified string in the TO field.
         */
        'TO' |
        '!TO' |

        /**
         * Messages that contain the specified string in the message body.
         */
        'BODY' |
        '!BODY' |

        /**
         * Messages that contain the specified string in the header OR the message body.
         */
        'TEXT' |
        '!TEXT' |

        /**
         * Messages with the specified keyword set.
         */
        'KEYWORD' |
        '!KEYWORD',
        string
    ];

    type SearchTermStringParam2 = [
        /**
         * Requires two string values, with the first being the header name and the second being the value to search
         * for. If this second string is empty, all messages that contain the given header name will be returned.
         */
        'HEADER',
        '!HEADER',
        string,
        string
    ];

    type SearchTermDateParam = [
        /**
         * Messages whose internal date (disregarding time and timezone) is earlier than the specified date.
         */
        'BEFORE' |
        '!BEFORE' |

        /**
         * Messages whose internal date (disregarding time and timezone) is within the specified date.
         */
        'ON' |
        '!ON' |

        /**
         * Messages whose internal date (disregarding time and timezone) is within or later than the specified date.
         */
        'SINCE' |
        '!SINCE' |

        /**
         * Messages whose Date header (disregarding time and timezone) is earlier than the specified date.
         */
        'SENTBEFORE' |
        '!SENTBEFORE' |

        /**
         * Messages whose Date header (disregarding time and timezone) is within the specified date.
         */
        'SENTON' |
        '!SENTON' |

        /**
         * Messages whose Date header (disregarding time and timezone) is within or later than the specified date.
         */
        'SENTSINCE' |
        '!SENTSINCE',

        string | Date
    ];

    type SearchTermIntParam = [
        /**
         * Messages with a size larger than the specified number of bytes.
         */
        'LARGER' |
        '!LARGER' |

        /**
         * Messages with a size smaller than the specified number of bytes.
         */
        'SMALLER' |
        '!SMALLER',
        number
    ];

    type SearchTermUID = Array<(number | string)>;

    export type _SearchTerm =
        SearchTermNoParam |
        SearchTermStringParam |
        SearchTermStringParam2 |
        SearchTermDateParam |
        SearchTermIntParam |
        SearchTermUID
        ;

    export type SearchTerm = _SearchTerm | ['OR', _SearchTerm, _SearchTerm];

    /**
     * System flags defined by RFC3501 that may be added/removed
     */
    type ImapMessageFlags =
        /**
         * Message has been read
         */
        '\\Seen' |

        /**
         * Message has been answered
         */
        '\\Answered' |

        /**
         * Message is "flagged" for urgent/special attention
         */
        '\\Flagged' |

        /**
         * Message is marked for removal
         */
        '\\Deleted' |

        /**
         * Message has not completed composition (marked as a draft).
         */
        '\\Draft';

    export interface IImapMessageAttributes {
        /**
         * A 32-bit ID that uniquely identifies this message within its mailbox.
         */
        uid: number;

        /**
         * A list of flags currently set on this message.
         */
        flags: ImapMessageFlags[];

        /**
         * The internal server date for the message.
         */
        date: Date;

        /**
         * The message's body structure (only set if requested with fetch()).
         */
        struct: any[]; // @FIXME

        /**
         * The RFC822 message size (only set if requested with fetch()).
         */
        size: number;
    }
}

declare module 'imap' {

    import { EventEmitter } from 'events';
    import { Readable } from 'stream';

    import { MessageSource, ErrorCallback, SearchTerm, SearchCallback } from 'imap/types';

    interface IImapMessageBodyInfo {
        /**
         * The specifier for this body (e.g. 'TEXT', 'HEADER.FIELDS (TO FROM SUBJECT)', etc).
         */
        which: string;

        /**
         * The size of this body in bytes.
         */
        size: number;
    }

    interface IImapMessage extends EventEmitter {
        /**
         * Emitted for each requested body. Example info properties:
         */
        on(event: 'body', listener: (stream: Readable, info: IImapMessageBodyInfo) => void): this;

        /**
         * Emitted when all message attributes have been collected.
         */
        once(event: 'attributes', listener: (attrs: IImapMessageAttributes) => void): this;

        /**
         * Emitted when all attributes and bodies have been parsed.
         */
        once(event: 'end', listener: () => void): this;
    }

    /**
     * an object representing a fetch() request. It consists of:
     */
    interface IImapFetch extends EventEmitter {
        /**
         * Emitted for each message resulting from a fetch request. seqno is the message's sequence number.
         */
        on(event: 'message', listener: (msg: IImapMessage, seqno: number) => void): this;

        /**
         * Emitted when an error occurred.
         */
        on(event: 'error', listener: (err: Error) => void): this;

        /**
         * Emitted when all messages have been parsed.
         */
        on(event: 'end', listener: () => void): this;
    }

    /**
     * Valid options properties for IConnectionCommon.fetch()
     */
    interface IFetchOptions {
        /**
         * Mark message(s) as read when fetched. Default: false
         */
        markSeen?: boolean;

        /**
         * Fetch the message structure. Default: false
         */
        struct?: boolean;

        /**
         * Fetch the message envelope. Default: false
         */
        envelope?: boolean;

        /**
         * Fetch the RFC822 size. Default: false
         */
        size?: boolean;

        /**
         * Fetch modifiers defined by IMAP extensions. Default: (none)
         */
        modifiers?: any;

        /**
         * Fetch custom fields defined by IMAP extensions, e.g. ['X-MAILBOX', 'X-REAL-UID']. Default: (none)
         */
        extensions?: string[];

        /**
         * A string or Array of strings containing the body part section to fetch. Default: (none)
         *
         * Example sections:
         *
         * 'HEADER' - The message header
         * 'HEADER.FIELDS (TO FROM SUBJECT)' - Specific header fields only
         * 'HEADER.FIELDS.NOT (TO FROM SUBJECT)' - Header fields only that do not match the fields given
         * 'TEXT' - The message body
         * '' - The entire message (header + body)
         * 'MIME' - MIME-related header fields only (e.g. 'Content-Type')
         *
         * Note: You can also prefix `bodies` strings (i.e. 'TEXT', 'HEADER', 'HEADER.FIELDS', and 'HEADER.FIELDS.NOT'
         * for `message/rfc822` messages and 'MIME' for any kind of message) with part ids. For example: '1.TEXT',
         * '1.2.HEADER', '2.MIME', etc.
         *
         * Note 2: 'HEADER*' sections are only valid for parts whose content type is `message/rfc822`, including the
         * root part (no part id).
         */
        bodies?: string | string[];
    }

    interface IBoxesItem {
        /**
         * mailbox attributes. An attribute of 'NOSELECT' indicates the mailbox cannot be opened
         */
        attribs: string[];

        /**
         * hierarchy delimiter for accessing this mailbox's direct children.
         */
        delimiter: string;

        /**
         * an object containing another structure similar in format to this top level otherwise null if no children
         */
        children: null | IBoxes;

        /**
         * reference to parent mailbox, null if at the top level
         */
        parent: null | IBoxesItem;
    }

    interface IBoxes {
        [name: string]: IBoxesItem;
    }

    /**
     * Box is an object representing the currently open mailbox
     */
    interface IBox {
        /**
         * The name of this mailbox.
         */
        name: string;

        /**
         * True if this mailbox was opened in read-only mode. (Only available with openBox() calls)
         */
        readOnly: boolean;

        keywords: string[];

        /**
         * True if new keywords can be added to messages in this mailbox.
         */
        newKeywords: boolean;

        /**
         * A 32-bit number that can be used to determine if UIDs in this mailbox have changed since the last time this
         * mailbox was opened.
         */
        uidvalidity: number;

        /**
         * The uid that will be assigned to the next message that arrives at this mailbox.
         */
        uidnext: number;

        /**
         * A list of system-defined flags applicable for this mailbox. Flags in this list but not in permFlags may be
         * stored for the current session only. Additional server implementation-specific flags may also be available.
         */
        flags: ImapMessageFlags[];

        /**
         * A list of flags that can be permanently added/removed to/from messages in this mailbox.
         */
        permFlags: ImapMessageFlags[];

        /**
         * Whether or not this mailbox has persistent UIDs. This should almost always be true for modern mailboxes and
         * should only be false for legacy mail stores where supporting persistent UIDs was not technically feasible.
         */
        persistentUIDs: boolean;

        /**
         * Contains various message counts for this mailbox
         */
        messages: {
            /**
             * Total number of messages in this mailbox.
             */
            total: number;

            /**
             * Number of messages in this mailbox having the Recent flag (this IMAP session is the first to see these
             * messages).
             */
            new: number;

            /**
             * (Only available with status() calls) Number of messages in this mailbox not having the Seen flag (marked
             * as not having been read).
             */
            unseen: number;
        };
    }

    type OpenBoxCallback = (err: Error, box: IBox) => void;
    type RenameBoxCallback = (err: Error, box: IBox) => void;
    type StatusCallback = (err: Error, box: IBox) => void;
    type GetBoxesCallback = (err: Error, boxes: IBoxes) => void;

    interface IConnectionConfig {
        /**
         * Username for plain-text authentication
         */
        user: string;

        /**
         * Password for plain-text authentication.
         */
        password: string;

        /**
         * Base64-encoded OAuth token for OAuth authentication for servers that support it (See Andris Reinman's
         * xoauth.js module to help generate this string).
         */
        xoauth?: string;

        /**
         * Base64-encoded OAuth2 token for The SASL XOAUTH2 Mechanism for servers that support it (See Andris Reinman's
         * xoauth2 module to help generate this string).
         */
        xoauth2?: string;

        /**
         * Hostname or IP address of the IMAP server. Default: "localhost"
         */
        host?: string;

        /**
         * Port number of the IMAP server. Default: 143
         */
        port?: number;

        /**
         * Perform implicit TLS connection? Default: false
         */
        tls?: boolean;

        /**
         * Options object to pass to tls.connect() Default: (none)
         */
        tlsOptions?: any; // @FIXME

        /**
         * Set to 'always' to always attempt connection upgrades via STARTTLS, 'required' only if upgrading is required,
         * or 'never' to never attempt upgrading. Default: 'never'
         */
        autotls?: 'always' | 'required' | 'never';

        /**
         * Number of milliseconds to wait for a connection to be established. Default: 10000
         */
        connTimeout?: number;

        /**
         * Number of milliseconds to wait to be authenticated after a connection has been established. Default: 5000
         */
        authTimeout?: number;

        /**
         * The timeout set for the socket created when communicating with the IMAP server. If not set, the socket will
         * not have a timeout. Default: 0
         */
        socketTimeout?: number;

        /**
         * Configures the keepalive mechanism. Set to true to enable keepalive with defaults or set to object to enable
         * and configure keepalive behavior: Default: true
         */
        keepalive?: true | {
            /**
             * This is the interval (in milliseconds) at which NOOPs are sent and the interval at which idleInterval is
             * checked. Default: 10000
             */
            interval: number;

            /**
             * This is the interval (in milliseconds) at which an IDLE command (for servers that support IDLE) is
             * re-sent. Default: 300000 (5 mins)
             */
            idleInterval: number;

            /**
             * Set to true to force use of NOOP keepalive on servers also support IDLE. Default: false
             */
            forceNoop: boolean;
        };

        /**
         * If set, the function will be called with one argument, a string containing some debug info
         * Default: (no debug output)
         */
        debug?: (debugInfo: string) => void;
    }

    interface IAppendOptions {
        /**
         * The name of the mailbox to append the message to. Default: the currently open mailbox
         */
        mailbox?: string;

        /**
         * A single flag (e.g. 'Seen') or an array of flags (e.g. ['Seen', 'Flagged']) to append to the message.
         * Default: (no flags)
         */
        flags?: string | string[];

        /**
         * What to use for message arrival date/time. Default: (current date/time)
         */
        date?: Date;
    }

    interface IConnectionCommon {
        /**
         * Searches the currently open mailbox for messages using given criteria. criteria is a list describing what you
         * want to find. For criteria types that require arguments, use an array instead of just the string criteria
         * type name (e.g. ['FROM', 'foo@bar.com']). Prefix criteria types with an "!" to negate.
         */
        search(criteria: SearchTerm[], callback: SearchCallback): void;

        /**
         * Fetches message(s) in the currently open mailbox.
         */
        fetch(source: MessageSource, options: {}): IImapFetch;

        /**
         * Copies message(s) in the currently open mailbox to another mailbox.
         */
        copy(source: MessageSource, mailboxName: string, callback: ErrorCallback): void;

        /**
         * Moves message(s) in the currently open mailbox to another mailbox.
         *
         * Note: The message(s) in the destination mailbox will have a new message UID.
         */
        move(source: MessageSource, mailboxName: string, callback: ErrorCallback): void;

        /**
         * Adds flag(s) to message(s).
         */
        addFlags(source: MessageSource, flags: string | string[], callback: ErrorCallback): void;

        /**
         * Removes flag(s) from message(s).
         */
        delFlags(source: MessageSource, flags: string | string[], callback: ErrorCallback): void;

        /**
         * Sets the flag(s) for message(s).
         */
        setFlags(source: MessageSource, flags: string | string[], callback: ErrorCallback): void;

        /**
         * Adds keyword(s) to message(s).
         */
        addKeywords(source: MessageSource, keywords: string | string[], callback: ErrorCallback): void;

        /**
         * Removes keyword(s) from message(s).
         */
        delKeywords(source: MessageSource, keywords: string | string[], callback: ErrorCallback): void;

        /**
         * Sets keyword(s) for message(s).
         */
        setKeywords(source: MessageSource, keywords: string | string[], callback: ErrorCallback): void;

        /**
         * Checks if the server supports the specified capability.
         */
        serverSupports(capability: string): boolean;
    }

    interface INamespaceEntry {
        /**
         * A string containing the prefix to use to access mailboxes in this namespace
         */
        prefix: string;

        /**
         * A string containing the hierarchy delimiter for this namespace, or boolean false for a flat namespace with no
         * hierarchy
         */
        delimiter: string;

        /**
         * An array of namespace extensions supported by this namespace, or null if none are specified
         */
        extensions: null | Array<{
            /**
             * A string indicating the extension name
             */
            name: string;

            /**
             * An array of strings containing the parameters for this extension, or null if none are specified
             */
            params: string[]
        }>;
    }

    interface IConnection extends EventEmitter, IConnectionCommon {
        /**
         * The current state of the connection.
         */
        state: 'disconnected' | 'connected' | 'authenticated';

        /**
         * The (top-level) mailbox hierarchy delimiter. If the server does not support mailbox hierarchies and only a
         * flat list, this value will be falsey.
         */
        delimiter: false | string;

        /**
         * Contains information about each namespace type (if supported by the server)
         *
         * There should always be at least one entry (although the IMAP spec allows for more, it doesn't seem to be very
         * common) in the personal namespace list, with a blank namespace prefix.
         */
        namespaces: {
            /**
             * Mailboxes that belong to the logged in user.
             */
            personal: INamespaceEntry[];

            /**
             * Mailboxes that belong to other users that the logged in user has access to.
             */
            other: INamespaceEntry[];

            /**
             * Mailboxes that are accessible by any logged in user.
             */
            shared: INamespaceEntry[];
        };

        _caps: string[];

        /**
         * Namespace for sequence number-based counterparts
         */
        seq: IConnectionCommon;

        /**
         * Creates and returns a new instance of Connection using the specified configuration object.
         */
        new (config: IConnectionConfig): this;

        /**
         * Attempts to connect and authenticate with the IMAP server.
         */
        connect(): void;

        /**
         * Closes the connection to the server after all requests in the queue have been sent.
         */
        end(): void;

        /**
         * Immediately destroys the connection to the server.
         */
        destroy(): void;

        /**
         * Opens a specific mailbox that exists on the server. mailboxName should include any necessary prefix/path.
         */
        openBox(mailboxName: string, callback: OpenBoxCallback): void;
        openBox(mailboxName: string, openReadOnly: boolean, callback: OpenBoxCallback): void;

        /**
         * Opens a specific mailbox that exists on the server. mailboxName should include any necessary prefix/path.
         * modifiers is used by IMAP extensions
         */
        openBox(mailboxName: string, openReadOnly: boolean, modifiers: {} /*@FIXME*/, callback?: OpenBoxCallback): void;

        /**
         * Closes the currently open mailbox.
         */
        closeBox(callback: ErrorCallback): void;

        /**
         * Closes the currently open mailbox. If autoExpunge is true, any messages marked as Deleted in the currently
         * open mailbox will be removed if the mailbox was NOT opened in read-only mode. If autoExpunge is false, you
         * disconnect, or you open another mailbox, messages marked as Deleted will NOT be removed from the currently
         * open mailbox.
         */
        closeBox(autoExpunge: boolean, callback: ErrorCallback): void;

        /**
         * Creates a new mailbox on the server. mailboxName should include any necessary prefix/path.
         */
        addBox(mailboxName: string, callback: ErrorCallback): void;

        /**
         * Removes a specific mailbox that exists on the server. mailboxName should including any necessary prefix/path.
         */
        delBox(mailboxName: string, callback: ErrorCallback): void;

        /**
         * Renames a specific mailbox that exists on the server. Both oldMailboxName and newMailboxName should include
         * any necessary prefix/path.
         *
         * Note: Renaming the 'INBOX' mailbox will instead cause all messages in 'INBOX' to be moved to the new mailbox.
         */
        renameBox(oldMailboxName: string, newMailboxName: string, callback: RenameBoxCallback): void;

        /**
         * Subscribes to a specific mailbox that exists on the server. mailboxName should include any necessary
         * prefix/path.
         */
        subscribeBox(mailboxName: string, callback: ErrorCallback): void;

        /**
         * Unsubscribes from a specific mailbox that exists on the server. mailboxName should include any necessary
         * prefix/path.
         */
        unsubscribeBox(mailboxName: string, callback: ErrorCallback): void;

        /**
         * Fetches information about a mailbox other than the one currently open.
         *
         * Note: There is no guarantee that this will be a fast operation on the server. Also, do not call this on the
         * currently open mailbox.
         */
        status(mailboxName: string, callback: StatusCallback): void;

        /**
         * Obtains the full list of mailboxes in the main personal namespace is used.
         */
        getBoxes(callback: GetBoxesCallback): void;

        /**
         * Obtains the full list of mailboxes in the namespace nsPrefix
         */
        getBoxes(nsPrefix: string, callback: GetBoxesCallback): void;

        /**
         * Obtains the full list of subscribed mailboxes in the main personal namespace
         */
        getSubscribedBoxes(callback: GetBoxesCallback): void;

        /**
         * Obtains the full list of subscribed mailboxes in the specified namespace
         */
        getSubscribedBoxes(nsPrefix: string, callback: GetBoxesCallback): void;

        /**
         * Permanently removes all messages flagged as Deleted in the currently open mailbox. If the server supports the
         * 'UIDPLUS' capability, uids can be supplied to only remove messages that both have their uid in uids and have
         * the \Deleted flag set.
         *
         * Note: At least on Gmail, performing this operation with any currently open mailbox that is not the Spam or
         * Trash mailbox will merely archive any messages marked as Deleted (by moving them to the 'All Mail' mailbox).
         */
        expunge(callback: ErrorCallback): void;
        expunge(uids: MessageSource, callback: ErrorCallback): void;

        /**
         * Appends a message to selected mailbox. msgData is a string or Buffer containing an RFC-822 compatible MIME
         * message.
         */
        append(msgData: string | Buffer, options: IAppendOptions, callback: ErrorCallback): void;

        /*
         * EVENTS
         */

        /**
         * Emitted when a connection to the server has been made and authentication was successful.
         */
        once(event: 'ready', listener: () => void): this;

        /**
         * Emitted when an error occurs. The 'source' property will be set to indicate where the error originated from.
         */
        once(event: 'error', listener: (err: Error) => void): this;

        /**
         * Emitted when the connection has ended.
         */
        // tslint:disable-next-line:unified-signatures
        once(event: 'end', listener: () => void): this;

        /**
         * Emitted when the server issues an alert (e.g. "the server is going down for maintenance").
         */
        on(event: 'alert', listener: (message: string) => void): this;

        /**
         * Emitted when new mail arrives in the currently open mailbox.
         */
        on(event: 'mail', listener: (numNewMsgs: number) => void): this;

        /**
         * Emitted when a message was expunged externally. seqno is the sequence number (instead of the unique UID) of
         * the message that was expunged. If you are caching sequence numbers, all sequence numbers higher than this
         * value MUST be decremented by 1 in order to stay synchronized with the server and to keep correct continuity.
         */
        on(event: 'expunge', listener: (seqno: number) => void): this;

        /**
         * Emitted if the UID validity value for the currently open mailbox changes during the current session.
         */
        on(event: 'uidvalidity', listener: (uidvalidity: number) => void): this;

        /**
         * Emitted when message metadata (e.g. flags) changes externally.
         */
        on(event: 'update', listener: (seqno: number, info) => void): this;

        /**
         * Emitted when the connection has completely closed.
         */
        on(event: 'close', listener: (hadError: boolean) => void): this;
    }

    interface IImap {
        new (config: IConnectionConfig): IConnection;

        /**
         * Parses a raw header and returns an object keyed on header fields and the values are Arrays of header field
         * values. Set disableAutoDecode to true to disable automatic decoding of MIME encoded-words that may exist in
         * header field values.
         *
         * @param rawHeader
         * @param disableAutoDecode
         */
        parseHeader(rawHeader: string, disableAutoDecode?: boolean): {};
    }

    const Imap: IImap;
    export = Imap;
}
