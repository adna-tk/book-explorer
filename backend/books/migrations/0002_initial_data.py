from django.db import migrations

def create_initial_books(apps, schema_editor):
    Book = apps.get_model('books', 'Book')
    
    Book.objects.create(
        title="Run Away",
        author="Harlan Coben",
        book_type="novel",
        genre="fiction",
        published_year=2019,
        cover_image=None,
        description=(
            "Run Away is a gripping thriller by Harlan Coben in which a teenage girl's disappearance "
            "sets off a series of unexpected revelations and twists. The story focuses on a father "
            "trying to understand the truth behind his daughter's vanishing, but soon confronts secrets "
            "that shed new light on his family and past. Coben's signature style of suspense, mystery, "
            "and fast-paced tension keeps the reader on edge until the very end. The novel explores the "
            "complexity of family relationships and the lengths people go to protect loved ones. "
            "It has become a reference in contemporary thriller fiction and inspired adaptations."
        )
    )
    Book.objects.create(
        title="The Final Detail",
        author="Harlan Coben",
        book_type="novel",
        genre="fiction",
        published_year=1998,
        cover_image=None,
        description=(
            "The Final Detail is a classic Coben thriller filled with family secrets, intrigue, and "
            "unexpected twists. The plot revolves around a mysterious case that threatens to unravel the "
            "main characters' safety while revealing layers of betrayal and hidden truths. Coben uses a "
            "fast pace and complex characters to keep readers guessing until the very last page. "
            "The story explores how past decisions affect present circumstances, creating a psychological "
            "puzzle full of suspense. This novel showcases Coben's talent for blending emotion with mystery."
        )
    )
    Book.objects.create(
        title="Tell No One",
        author="Harlan Coben",
        book_type="novel",
        genre="fiction",
        published_year=2001,
        cover_image=None,
        description=(
            "Tell No One is a suspenseful mystery where former doctor David Beck seeks the truth about "
            "his wife's murder. When he receives a sign that she might still be alive, Beck embarks on a "
            "dangerous journey, facing dangerous enemies and numerous twists. The novel is known for its "
            "fast pace and multiple reversals that test trust and perception. Coben builds tension through "
            "psychological games and secrets from the characters' pasts. The book inspired a French film "
            "adaptation due to its universal suspense and emotional depth."
        )
    )

    Book.objects.create(
        title="The Selfish Gene",
        author="Richard Dawkins",
       book_type="novel",
        genre="self_help",
        published_year=1976,
        cover_image=None,
        description=(
            "The Selfish Gene presents a gene-centered view of evolution, arguing that genes are the primary "
            "units of natural selection and that selfish behaviors of organisms arise from the interests of genes. "
            "Dawkins explains how genes survive and propagate, including situations where altruism occurs as a "
            "strategy to indirectly benefit gene replication. The book explores the development of life, the role "
            "of DNA, and organism behavior under evolutionary pressures. It has had a profound impact on popular "
            "science, changing the understanding of evolution and biology. The book is praised for its clarity and "
            "accessibility, remaining one of the most influential scientific works."
        )
    )
    Book.objects.create(
        title="When the Body Says No",
        author="Gabor Maté",
        book_type="novel",
        genre="self_help",
        published_year=2003,
        cover_image=None,
        description=(
            "When the Body Says No explores the connection between stress, emotions, and chronic illness. "
            "Gabor Maté examines how suppressed emotions and unresolved psychological conflicts can manifest "
            "as physical disease. The book combines case studies with scientific research to highlight the "
            "importance of emotional well-being in overall health. It emphasizes the mind-body connection and "
            "offers insights into preventative health care and self-awareness. This work is widely regarded in "
            "both medical and self-help communities for its profound perspective on holistic health."
        )
    )
    Book.objects.create(
        title="Atomic Habits",
        author="James Clear",
        book_type="novel",
        genre="self_help",
        published_year=2018,
        cover_image=None,
        description=(
            "Atomic Habits is a practical guide for improving life through small, consistent changes. "
            "James Clear explains how tiny 'atomic' habits compound over time to create remarkable results. "
            "The book focuses on systems and principles that make building good habits and breaking bad ones easier. "
            "Clear emphasizes environmental cues, identity shifts, and systematic tracking to reinforce positive habits. "
            "It has become highly popular worldwide and is considered a modern classic in self-help literature."
        )
    )
    Book.objects.create(
        title="The Monk Who Sold His Ferrari",
        author="Robin Sharma",
        book_type="novel",
        genre="self_help",
        published_year=1997,
        cover_image=None,
        description=(
            "The Monk Who Sold His Ferrari is a fable about finding balance, happiness, and purpose in life. "
            "It follows a successful lawyer who, after a life crisis, travels to India to learn spiritual wisdom. "
            "Through parables and lessons, the book teaches values such as mindfulness, discipline, and personal growth. "
            "The narrative emphasizes the importance of living intentionally and prioritizing inner peace over material success. "
            "This work is widely read for its practical life advice delivered in an engaging story format."
        )
    )

    Book.objects.create(
        title="One Hundred Years of Solitude",
        author="Gabriel Garcia Marquez",
        book_type="novel",
        genre="fiction",
        published_year=1967,
        cover_image=None,
        description=(
            "One Hundred Years of Solitude is an epic novel following multiple generations of the Buendía family "
            "in the fictional town of Macondo, blending magical and realistic elements. "
            "The novel explores themes of love, destiny, history, isolation, and the cyclical nature of life. "
            "Written by Gabriel García Márquez, it is considered one of the most important novels of the 20th century "
            "and a key work of magical realism. The story combines personal dramas with broader social satire, "
            "leaving a profound and lasting impact on readers."
        )
    )
    Book.objects.create(
        title="To Kill a Mockingbird",
        author="Harper Lee",
        book_type="novel",
        genre="fiction",
        published_year=1960,
        cover_image=None,
        description=(
            "To Kill a Mockingbird is an American classic exploring justice, racism, and moral growth through "
            "the eyes of young Scout Finch in Maycomb, Alabama. "
            "Her father, Atticus Finch, defends Tom Robinson, a black man wrongly accused of rape, despite societal pressures. "
            "The novel combines a coming-of-age story with sharp commentary on social injustice and empathy. "
            "It is praised for its emotional depth and timeless lessons about human nature and the fight for justice."
        )
    )
    Book.objects.create(
        title="Love in the Time of Cholera",
        author="Gabriel Garcia Marquez",
        book_type="novel",
        genre="fiction",
        published_year=1985,
        cover_image=None,
        description=(
            "Love in the Time of Cholera is a romantic story about the enduring love between Florentino Ariza and Fermina Daza "
            "that lasts for decades despite obstacles and separation. "
            "The novel follows their lives, loves, and challenges, including Fermina's marriage to another man and Florentino's affairs. "
            "After Fermina's husband dies, Florentino reasserts his devotion, showing the power of faith and patience in love. "
            "The book explores themes of aging, romantic commitment, and the passage of time shaping human relationships."
        )
    )
    Book.objects.create(
        title="The Little Prince",
        author="Antoine de Saint-Exupéry",
        book_type="novel",
        genre="fantasy",
        published_year=1943,
        cover_image=None,
        description=(
            "The Little Prince is a poetic tale about a young prince traveling from planet to planet, exploring life, "
            "friendship, love, and self-discovery. "
            "Through his conversations with a stranded pilot in the Sahara, the story addresses philosophical themes "
            "and questions of human nature. "
            "The book serves as an allegory for life's journey, with its joys, sorrows, and lessons. "
            "It remains one of the most translated and beloved literary works worldwide."
        )
    )
    Book.objects.create(
        title="Before the Coffee Gets Cold",
        author="Toshikazu Kawaguchi",
        book_type="novel",
        genre="fiction",
        published_year=2015,
        cover_image=None,
        description=(
            "Before the Coffee Gets Cold is a warm, magical story set in a café where people can briefly travel back in time. "
            "The narrative focuses on characters facing grief, loss, and longing, using the café's time-travel rule "
            "to confront past decisions. "
            "Each visit must end before the last sip of coffee is gone, adding emotional urgency and depth. "
            "The book explores themes of regret, forgiveness, and reconciling with one's past."
        )
    )

    Book.objects.create(
        title="Dune",
        author="Frank Herbert",
        book_type="novel",
        genre="sci_fi",
        published_year=1965,
        cover_image=None,
        description=(
            "Dune is an epic science fiction novel set in a distant future with feudal interstellar society "
            "where noble families control planetary fiefs. "
            "The story follows Paul Atreides and his family after being assigned to the desert planet Arrakis, "
            "the sole source of the valuable spice 'melange' enabling advanced mental abilities and space travel. "
            "The novel explores politics, religion, ecology, and human destiny through complex conflicts and alliances. "
            "Dune won Hugo and Nebula awards and remains one of the most influential science fiction novels in history."
        )
    )
    Book.objects.create(
        title="Harry Potter and the Philosopher's Stone",
        author="J.K. Rowling",
        book_type="novel",
        genre="fantasy",
        published_year=1997,
        cover_image=None,
        description=(
            "Harry Potter and the Philosopher's Stone is the first book in the Harry Potter series, introducing "
            "young wizard Harry Potter who discovers his magical heritage and attends Hogwarts School of Witchcraft. "
            "During his first year, Harry makes friends and enemies, learns magic, and uncovers the mystery of the Philosopher's Stone. "
            "The book deals with friendship, courage, fighting evil, and self-discovery. "
            "It became a global phenomenon, launching one of the most famous literary and film franchises of all time."
        )
    )

    Book.objects.create(
        title="Leaves of Grass",
        author="Walt Whitman",
        book_type="poetry",
        genre="fiction",
        published_year=1855,
        cover_image=None,
        description=(
            "Leaves of Grass is a collection of poetry by American poet Walt Whitman, first published in 1855. "
            "This groundbreaking work revolutionized American poetry with its free verse style and celebration of democracy, "
            "nature, love, and friendship. Whitman's innovative use of free verse broke away from traditional poetic forms, "
            "creating a uniquely American voice that celebrated the common person and the beauty of everyday life. "
            "The collection includes some of the most famous poems in American literature, such as 'Song of Myself' and 'O Captain! My Captain!'. "
            "Whitman continuously revised and expanded the collection throughout his life, with the final 'deathbed edition' containing over 400 poems. "
            "Leaves of Grass is considered one of the most important works in American literature and has influenced countless poets worldwide."
        )
    )
    Book.objects.create(
        title="The Waste Land",
        author="T.S. Eliot",
        book_type="poetry",
        genre="fiction",
        published_year=1922,
        cover_image=None,
        description=(
            "The Waste Land is a landmark poem by T.S. Eliot, first published in 1922. This modernist masterpiece is widely regarded "
            "as one of the most important poems of the 20th century. The poem is divided into five sections and uses a fragmented, "
            "collage-like structure to explore themes of disillusionment, spiritual desolation, and the decay of Western civilization "
            "in the aftermath of World War I. Eliot weaves together multiple voices, languages, and literary allusions, drawing from "
            "mythology, religion, and classical literature to create a complex portrait of a world in crisis. "
            "The poem's innovative use of stream-of-consciousness, multiple narrators, and dense intertextuality revolutionized modern poetry. "
            "Despite its challenging nature, The Waste Land has become one of the most studied and influential works in English literature, "
            "establishing Eliot as a leading voice of the modernist movement."
        )
    )


def reverse_create_initial_books(apps, schema_editor):
    """
    Reverse migration: Delete all books created by this migration.
    """
    Book = apps.get_model('books', 'Book')
    Book.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_books, reverse_create_initial_books),
    ]
